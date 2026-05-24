/**
 * Sync helper for server-persisted configuration (photos, soundtracks, RSVPs)
 */

export interface GlobalData {
  custom_photo_1: string | null;
  custom_photo_2: string | null;
  ouaga_50_rsvps: any[];
  custom_youtube_tracks: any[];
}

export let currentPhoto1: string | null = null;
export let currentPhoto2: string | null = null;

export function updateMemoryPhotos(p1?: string | null, p2?: string | null) {
  if (p1 !== undefined) currentPhoto1 = p1;
  if (p2 !== undefined) currentPhoto2 = p2;
}

// Fetch current snapshot from server, sync to localStorage, and dispatch update events
export async function syncFromServer() {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error("Failed to load server data");
    const data: GlobalData = await response.json();

    // Only update and trigger events on differences to avoid cycles
    let photosChanged = false;
    let tracksChanged = false;
    let rsvpsChanged = false;

    // Custom Photo 1
    const rawPhoto1 = localStorage.getItem("custom_photo_1");
    const localPhoto1 = (rawPhoto1 === "null" || rawPhoto1 === "undefined") ? null : rawPhoto1;
    
    // Initialize memory cache from localStorage if empty
    if (!currentPhoto1 && localPhoto1) {
      currentPhoto1 = localPhoto1;
    }

    if (currentPhoto1 && !data.custom_photo_1) {
      await pushToServer("custom_photo_1", currentPhoto1);
      data.custom_photo_1 = currentPhoto1;
    } else if (currentPhoto1 !== data.custom_photo_1) {
      currentPhoto1 = data.custom_photo_1;
      if (data.custom_photo_1) {
        try {
          localStorage.setItem("custom_photo_1", data.custom_photo_1);
        } catch (e) {
          console.warn("Failed to save custom_photo_1 to local storage (quota limit, using memory cache instead):", e);
        }
      } else {
        localStorage.removeItem("custom_photo_1");
      }
      photosChanged = true;
    }

    // Custom Photo 2
    const rawPhoto2 = localStorage.getItem("custom_photo_2");
    const localPhoto2 = (rawPhoto2 === "null" || rawPhoto2 === "undefined") ? null : rawPhoto2;
    
    // Initialize memory cache from localStorage if empty
    if (!currentPhoto2 && localPhoto2) {
      currentPhoto2 = localPhoto2;
    }

    if (currentPhoto2 && !data.custom_photo_2) {
      await pushToServer("custom_photo_2", currentPhoto2);
      data.custom_photo_2 = currentPhoto2;
    } else if (currentPhoto2 !== data.custom_photo_2) {
      currentPhoto2 = data.custom_photo_2;
      if (data.custom_photo_2) {
        try {
          localStorage.setItem("custom_photo_2", data.custom_photo_2);
        } catch (e) {
          console.warn("Failed to save custom_photo_2 to local storage (quota limit, using memory cache instead):", e);
        }
      } else {
        localStorage.removeItem("custom_photo_2");
      }
      photosChanged = true;
    }

    const currentRsvpsString = localStorage.getItem("ouaga_50_rsvps") || "[]";
    const serverRsvpsString = JSON.stringify(data.ouaga_50_rsvps);
    if (currentRsvpsString !== serverRsvpsString) {
      localStorage.setItem("ouaga_50_rsvps", serverRsvpsString);
      rsvpsChanged = true;
    }

    const currentTracksString = localStorage.getItem("custom_youtube_tracks") || "[]";
    const serverTracksString = JSON.stringify(data.custom_youtube_tracks);
    if (currentTracksString !== serverTracksString) {
      localStorage.setItem("custom_youtube_tracks", serverTracksString);
      tracksChanged = true;
    }

    // Trigger local events to update active component state reactivity
    if (photosChanged) {
      window.dispatchEvent(new Event("custom-photo-update"));
    }
    if (rsvpsChanged) {
      window.dispatchEvent(new Event("ouaga-rsvp-update"));
    }
    if (tracksChanged) {
      window.dispatchEvent(new Event("custom-youtube-update"));
    }

    return data;
  } catch (error) {
    console.warn("Offline fallback - Could not load server background sync:", error);
    return null;
  }
}

// Send local storage changes to the central database
export async function pushToServer(key: keyof GlobalData, value: any) {
  try {
    const payload = { [key]: value };
    const response = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to post server synchronization");
    return true;
  } catch (error) {
    console.error("Network synchronization failed for key: " + String(key), error);
    return false;
  }
}
