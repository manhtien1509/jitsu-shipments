import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function AssignmentSearchBar({ value, onChange }: Props) {
  return (
    <Input
      leftIcon={<Search className="h-4 w-4" />}
      rightIcon={
        value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-neutral-400 hover:text-neutral-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null
      }
      placeholder="Search by label..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
