import PlacesAutocomplete from 'react-places-autocomplete';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PhotoPage() {
  const [image, setImage] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const router = useRouter();

  const analyzeImage = async (imageBase64: string) => {
    const response = await fetch("/api/smile-detection-gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64 }),
    });
    const data = await response.json();
    return data.score;
  };

  useEffect(() => {
    const storedImage = localStorage.getItem("previewImage"); // for showing
    const storedBase64 = localStorage.getItem("base64Image"); // for sending

    if (storedImage) setImage(storedImage);
    if (storedBase64) {
      analyzeImage(storedBase64).then((score) => setScore(score));
    } else {
      router.push("/camera");
    }
  }, []);

  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  const handleSelect = async (value: string) => {
    setAddress(value);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: value }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        setCoordinates({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        console.warn("Geocoding failed:", status);
      }
    });
  };

  const handleSubmitSmiley = async () => {
    if (!coordinates.lat || !coordinates.lng) return;

    const imageBase64 = localStorage.getItem("base64Image");

    await fetch("/api/add-smiley", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score,
        lat: coordinates.lat,
        lng: coordinates.lng,
        image: imageBase64,
      }),
    });

    router.push("/dashboard");
  };

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

      <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="w-full max-w-xs mt-4">
            <input
              {...getInputProps({
                placeholder: "Type address…",
              })}
              className="w-full px-3 py-2 border rounded text-black placeholder-gray-600"
            />
            <div className="bg-white border mt-1 rounded">
              {loading && <div className="px-3 py-1 text-gray-500">Loading...</div>}
              {suggestions.map((suggestion, i) => (
                <div
                  {...getSuggestionItemProps(suggestion)}
                  key={i}
                  className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-black"
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      <button
        onClick={handleSubmitSmiley}
        className="mt-4 bg-yellow-400 px-6 py-2 rounded hover:bg-yellow-500"
      >
        Add Smiley
      </button>
    </div>
  );
}