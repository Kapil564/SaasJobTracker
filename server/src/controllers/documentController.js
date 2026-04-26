import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { Readable } from "stream";
import { decrypt } from "../utils/crypto.js";

export const uploadToDrive = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    let { google_access_token, google_refresh_token } = req.user;

    if (!google_access_token) {
      return res.status(401).json({ error: "User has not connected Google Drive. Please log in with Google again." });
    }

    // Fix 1: Decrypt tokens
    google_access_token = decrypt(google_access_token);
    google_refresh_token = decrypt(google_refresh_token);

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({
      access_token: google_access_token,
      refresh_token: google_refresh_token,
    });

    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const folderName = "JobsResume";
    let folderId = null;

    const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
    const searchResponse = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (searchResponse.data.files.length > 0) {
      folderId = searchResponse.data.files[0].id;
    } else {
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };
      const folderResponse = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
      });
      folderId = folderResponse.data.id;
    }

    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    const driveResponse = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
        parents: [folderId],
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
    });

    res.json({
      message: "File uploaded to Google Drive successfully",
      fileId: driveResponse.data.id,
      fileName: file.originalname
    });
  } catch (error) {
    console.error("Error uploading to drive:", error);
    res.status(500).json({ error: "Failed to upload to Google Drive." });
  }
};

export const getDriveFiles = async (req, res) => {
  try {
    let { google_access_token, google_refresh_token } = req.user;

    if (!google_access_token) {
      return res.status(401).json({ error: "User has not connected Google Drive." });
    }

    google_access_token = decrypt(google_access_token);
    google_refresh_token = decrypt(google_refresh_token);

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({
      access_token: google_access_token,
      refresh_token: google_refresh_token,
    });

    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const folderName = "JobsResume";
    const folderQuery = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
    const searchResponse = await drive.files.list({
      q: folderQuery,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (searchResponse.data.files.length === 0) {
      return res.json({ files: [] });
    }

    const folderId = searchResponse.data.files[0].id;

    const filesQuery = `'${folderId}' in parents and trashed=false`;
    const filesResponse = await drive.files.list({
      q: filesQuery,
      fields: 'files(id, name, createdTime, size, mimeType)',
      orderBy: 'createdTime desc',
    });

    const formattedFiles = filesResponse.data.files.map(file => ({
      id: file.id,
      name: file.name,
      company: 'General / Generic', 
      position: 'General / Generic',
      date: new Date(file.createdTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: file.size ? (parseInt(file.size) / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown',
      mimeType: file.mimeType
    }));

    res.json({ files: formattedFiles });
  } catch (error) {
    console.error("Error fetching files from drive:", error);
    res.status(500).json({ error: "Failed to fetch files from Google Drive." });
  }
};
