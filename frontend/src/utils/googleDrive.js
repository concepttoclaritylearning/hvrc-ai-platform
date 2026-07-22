/**
 * HVRC.AI Google Drive Storage Client
 * Zero-Server DB strategy: User data (Projects, Chats, Workspace Code, Knowledge)
 * is stored directly in the user's personal Google Drive inside "/HVRC.AI Workspace/".
 */

const DRIVE_FOLDER_NAME = "HVRC.AI Workspace";

/**
 * Helper to execute authorized fetch to Google Drive API v3
 */
async function driveFetch(accessToken, endpoint, options = {}) {
  const res = await fetch(`https://www.googleapis.com/drive/v3/${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Drive API Error (${res.status}): ${errText}`);
  }

  return res.json();
}

/**
 * Get or create the HVRC.AI root folder on user's Google Drive
 */
export async function getOrCreateDriveFolder(accessToken) {
  try {
    // Search for existing folder
    const searchRes = await driveFetch(
      accessToken,
      `files?q=name='${DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
    );

    if (searchRes.files && searchRes.files.length > 0) {
      return searchRes.files[0].id;
    }

    // Create new folder
    const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: DRIVE_FOLDER_NAME,
        mimeType: "application/vnd.google-apps.folder",
      }),
    });

    const folderData = await createRes.json();
    return folderData.id;
  } catch (err) {
    console.error("Failed to get/create Google Drive folder:", err);
    return null;
  }
}

/**
 * Save user projects and workspace state to Google Drive as projects.json
 */
export async function saveProjectsToDrive(accessToken, projectsData) {
  try {
    const folderId = await getOrCreateDriveFolder(accessToken);
    if (!folderId) return false;

    // Check if projects.json exists in folder
    const search = await driveFetch(
      accessToken,
      `files?q=name='projects.json' and '${folderId}' in parents and trashed=false`
    );

    const fileContent = JSON.stringify(projectsData, null, 2);
    const blob = new Blob([fileContent], { type: "application/json" });

    if (search.files && search.files.length > 0) {
      // Update existing file
      const fileId = search.files[0].id;
      await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: fileContent,
      });
    } else {
      // Create new file with metadata
      const metadata = {
        name: "projects.json",
        parents: [folderId],
        mimeType: "application/json",
      };

      const form = new FormData();
      form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      form.append("file", blob);

      await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });
    }

    return true;
  } catch (err) {
    console.error("Error saving projects to Google Drive:", err);
    return false;
  }
}

/**
 * Load projects and workspace data from user's Google Drive
 */
export async function loadProjectsFromDrive(accessToken) {
  try {
    const folderId = await getOrCreateDriveFolder(accessToken);
    if (!folderId) return null;

    const search = await driveFetch(
      accessToken,
      `files?q=name='projects.json' and '${folderId}' in parents and trashed=false`
    );

    if (search.files && search.files.length > 0) {
      const fileId = search.files[0].id;
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return await res.json();
    }

    return null;
  } catch (err) {
    console.error("Error loading projects from Google Drive:", err);
    return null;
  }
}
