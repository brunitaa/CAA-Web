import { useState, useEffect } from "react";

export default function PictogramForm({ initialData = {}, onSubmit }) {
  const [name, setName] = useState(initialData.name || "");
  const [lemma, setLemma] = useState(initialData.lemma || "");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (initialData.name) setName(initialData.name);
    if (initialData.lemma) setLemma(initialData.lemma);
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("lemma", lemma);
    if (file) {
      formData.append("image", file); // ⚠️ solo si selecciona nueva imagen
    }

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded-xl shadow-lg"
    >
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded p-2 w-full"
      />
      <input
        type="text"
        placeholder="Lemma"
        value={lemma}
        onChange={(e) => setLemma(e.target.value)}
        className="border rounded p-2 w-full"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {initialData.image?.fullUrl && (
        <div>
          <p className="text-gray-600 text-sm">Imagen actual:</p>
          <img
            src={initialData.image.fullUrl}
            alt={initialData.name}
            className="w-24 h-24 object-contain rounded"
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Guardar
      </button>
    </form>
  );
}
