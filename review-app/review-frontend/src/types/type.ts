import { ChangeEvent } from "react";
import { Review } from "@/models/Review";

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  disabled?: boolean;
  max?: number;
  min?: number;
  placeholder?: string;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface FormProps {
  formData: {
    title: string;
    description: string;
    rating: number;
    location: string;
  };
  isEdit: boolean;
  handleFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCreateOrUpdateSubmit: () => void;
  handleCancle: () => void;
}

export interface CardProps {
  review: Review;
  setIsEdit: (value: boolean) => void;
  setFormData: (formData: {
    title: string;
    description: string;
    rating: number;
    location: string;
  }) => void;
}

export interface ButtonProps {
  label: string;
  colorScheme: "purple" | "blue" | "slate";
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}
