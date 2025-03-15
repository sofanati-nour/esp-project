"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    mode: 1,
    acin: 0,
    acout: 0,
    steps: 1,
    load: 0,
    protection: 0,
    ssid: "",
    pass: "",
    value: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch("/api/get");
        const data = await response.json();

        // Only update if we got valid data back
        if (data) {
          setFormData({
            mode: Number(data.mode) || 1,
            acin: Number(data.acin) || 0,
            acout: Number(data.acout) || 0,
            steps: Number(data.steps) || 1,
            load: Number(data.load) || 0,
            protection: Number(data.protection) || 0,
            ssid: data.ssid || "",
            pass: data.pass || "",
            value: data.value || "",
          });
        }
      } catch (error) {
        setMessage(
          `Error loading initial data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(
        `Error submitting form: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          System Configuration
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mode (1-5)</label>
            <input
              type="number"
              name="mode"
              min="1"
              max="5"
              value={formData.mode}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              AC Input (0-220)
            </label>
            <input
              type="number"
              name="acin"
              min="0"
              max="220"
              value={formData.acin}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              AC Output (0-220)
            </label>
            <input
              type="number"
              name="acout"
              min="0"
              max="220"
              value={formData.acout}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Steps (1-16)
            </label>
            <input
              type="number"
              name="steps"
              min="1"
              max="16"
              value={formData.steps}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Load (0-100)
            </label>
            <input
              type="number"
              name="load"
              min="0"
              max="100"
              value={formData.load}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Protection (0-2)
            </label>
            <input
              type="number"
              name="protection"
              min="0"
              max="2"
              value={formData.protection}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">SSID</label>
            <input
              type="text"
              name="ssid"
              value={formData.ssid}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="text"
              name="pass"
              value={formData.pass}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

            

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
