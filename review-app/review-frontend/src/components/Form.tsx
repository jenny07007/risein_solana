import { FC, FormEvent, useRef, useEffect } from "react";
import { FormProps } from "@/types/type";
import FormField from "./FormField";
import Button from "./Button";

const ReviewForm: FC<FormProps> = ({
  formData,
  handleFormChange,
  handleCreateOrUpdateSubmit,
  isEdit,
  handleCancle,
}) => {
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const isFormFilled =
    formData.title &&
    formData.description &&
    formData.rating &&
    formData.location;

  useEffect(() => {
    if (isEdit && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  }, [isEdit]);

  const formSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.rating < 0 || formData.rating > 10) {
      alert("Rating must be between 0 and 10.");
      return;
    }
    handleCreateOrUpdateSubmit();
  };

  return (
    <form
      className="shadow-md rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={formSubmit}
    >
      <div className="w-full max-w-xs">
        <FormField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleFormChange}
          disabled={isEdit}
          placeholder="Title"
        />
        <FormField
          label="Description"
          name="description"
          type="text"
          value={formData.description}
          onChange={handleFormChange}
          placeholder="Description"
          required
          ref={descriptionInputRef}
        />
        <FormField
          label="Rating"
          name="rating"
          type="number"
          value={formData.rating}
          onChange={handleFormChange}
          max={10}
          min={0}
          placeholder="Rating"
          required
        />
        <FormField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleFormChange}
          placeholder="Location"
          required
        />
        <div className="flex items-center justify-between">
          {isEdit && (
            <Button label="Cancel" onClick={handleCancle} colorScheme="slate" />
          )}
          <Button
            label={isEdit ? "Update" : "Submit"}
            onClick={() => {}}
            colorScheme={isEdit ? "purple" : "blue"}
            disabled={!isFormFilled}
          />
        </div>

        {!isFormFilled && (
          <p className="text-red-400 pt-5 text-sm">
            Please fill all fields.{" "}
            <span className="block">Rating should be greater than 0.</span>
          </p>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
