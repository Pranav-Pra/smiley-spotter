import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PhotoPage() {
  const [image, setImage] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const router = useRouter();

//   const analyzeImage = async (base64: string) => {
//     try {
//       const res = await fetch("/api/smile-detection-gemini", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ base64Image: base64 }),
//       });

//       const data = await res.json();
//       setScore(data.score);
//     } catch (err) {
//       console.error("Failed to score image", err);
//       setScore(0);
//     }
//   };

  const analyzeImage = async (imageBase64: string) => {
  const response = await fetch("/api/smile-detection-gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64 }),
  });
  const data = await response.json();
  return data.score;
};

//   useEffect(() => {
//     const storedImage = localStorage.getItem("uploadedImageBase64");
//     if (!storedImage) {
//       router.push("/camera"); // if no image found, redirect back
//     } else {
//         setImage(storedImage);
//         analyzeImage(storedImage).then(score => {
//         setScore(score);
//     });
//     }
//   }, []);
useEffect(() => {
  const storedImage = localStorage.getItem("previewImage"); // for showing
  const storedBase64 = localStorage.getItem("base64Image"); // for scoring

  if (storedImage) setImage(storedImage);
  if (storedBase64) {
    analyzeImage(storedBase64).then((score) => setScore(score));
  }
}, []);
  

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-6">
      <h2 className="text-xl font-semibold text-black mb-4">
        Points: {score !== null ? score : "Loading..."}
      </h2>

      {image && (
        <img
          src={image}
          alt="Uploaded"
          className="max-w-xs rounded-lg shadow-md"
        />
      )}
    </div>
  );
}