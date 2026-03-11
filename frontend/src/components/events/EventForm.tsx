import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  visibility: "public" | "private";
}

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => void;
  submitText: string;
  cancelLink: string;
}

export const EventForm = ({
  initialData,
  onSubmit,
  submitText,
  cancelLink,
}: EventFormProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    visibility: "public",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Event Title *"
        required
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g., Tech Conference 2026"
      />

      <Textarea
        label="Description *"
        required
        name="description"
        rows={4}
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe what makes your event special..."
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date *"
          required
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <Input
          label="Time *"
          required
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Location *"
        required
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="e.g., Convention Center"
      />

      <Input
        label="Capacity (optional)"
        type="number"
        name="capacity"
        min="1"
        value={formData.capacity}
        onChange={handleChange}
        placeholder="Leave empty for unlimited"
        helperText="Maximum number of participants. Leave empty for unlimited capacity."
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visibility
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={formData.visibility === "public"}
              onChange={handleChange}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span>Public - Anyone can see and join this event</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={formData.visibility === "private"}
              onChange={handleChange}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span>Private - Only invited people can see this event</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Link
          to={cancelLink}
          className="flex-1 inline-flex justify-center items-center border border-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition font-medium"
        >
          Cancel
        </Link>
        <Button type="submit" className="flex-1">
          {submitText}
        </Button>
      </div>
    </form>
  );
};
