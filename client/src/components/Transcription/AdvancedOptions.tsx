import { Dispatch, SetStateAction } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AdvancedOptionsProps {
  speechModel: "base" | "best";
  setSpeechModel: Dispatch<SetStateAction<"base" | "best">>;
}

const AdvancedOptions = ({ speechModel, setSpeechModel }: AdvancedOptionsProps) => {
  const handleSpeechModelChange = (value: string) => {
    setSpeechModel(value as "base" | "best");
  };

  return (
    <div className="mb-6">
      <details className="text-sm">
        <summary className="text-primary font-medium cursor-pointer mb-2">
          Advanced options
        </summary>
        <div className="pl-4 pt-2 pb-1 border-l-2 border-gray-200">
          <div className="mb-4">
            <Label htmlFor="speech-model" className="block text-sm font-medium text-gray-700 mb-1">
              Speech Model
            </Label>
            <Select value={speechModel} onValueChange={handleSpeechModelChange}>
              <SelectTrigger id="speech-model" className="w-full">
                <SelectValue placeholder="Select a speech model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="best">Best (Most accurate)</SelectItem>
                  <SelectItem value="base">Base (Faster)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </details>
    </div>
  );
};

export default AdvancedOptions;
