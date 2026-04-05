// Convert uploaded file to base64 string for localStorage storage
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    // Resize large images before storing to save localStorage space
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX = 800;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
        else { width = Math.round((width * MAX) / height); height = MAX; }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => reader.readAsDataURL(file);
    const url = URL.createObjectURL(file);
    img.src = url;
  });
}
