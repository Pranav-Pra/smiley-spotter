import { useState } from "react";
import { useRouter } from "next/router";

export default function CameraPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // For preview
  const imageUrl = URL.createObjectURL(file);
  setImage(imageUrl);
  localStorage.setItem("previewImage", imageUrl); // 👈 new key

  // For Gemini
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64 = reader.result?.toString();
    if (base64) {
      localStorage.setItem("base64Image", base64); // 👈 new key
    }
  };
  reader.readAsDataURL(file);
};

// const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64String = reader.result as string;
//       localStorage.setItem("uploadedImageBase64", base64String);
//       setImage(base64String); // or image URL if needed
//     };
//     reader.readAsDataURL(file);
//   }
// };

  const handleUpload = () => {
    if (image) {
        localStorage.setItem("uploadedImage", image);
        router.push("/photo");
    }
  };

  

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 space-y-6">

    <button
        onClick={() => router.push("/dashboard")}
        className="absolute top-4 right-4 bg-gray-200 text-black px-2 py-1 rounded shadow hover:bg-gray-300 transition"
    >
        Back
    </button>
  
    <div className="flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-semibold text-black text-center">Select an Image</h1>

        <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
        className="block text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-yellow-400 file:text-black
            hover:file:bg-yellow-500"
        />
    </div>`

      {image && (
        <img
          src={image}
          alt="Preview"
          className="w-64 h-64 object-cover rounded shadow"
        />
      )}

      <button
        onClick={handleUpload}
        disabled={!image}
        className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold shadow hover:bg-yellow-500 disabled:opacity-50"
      >
        Upload Image
      </button>
    </main>
  );
}