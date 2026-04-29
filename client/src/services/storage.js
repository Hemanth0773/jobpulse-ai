import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase.js';

export async function uploadResume(file, userId) {
  const timestamp = Date.now();
  const storageRef = ref(storage, `resumes/${userId}/${timestamp}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return {
    url: downloadUrl,
    fileName: file.name,
    path: snapshot.ref.fullPath,
  };
}
