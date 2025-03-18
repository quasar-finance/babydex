import { IconSearch } from "@tabler/icons-react";
import { Button } from "~/app/components/atoms/Button";
import Input from "~/app/components/atoms/Input";
import TestToasts from "~/app/components/templates/TestToasts";

export default function TestComponents() {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl">BUTTONS</h2>
      <div className="flex gap-4 flex-wrap">
        <Button variant="solid">Solid</Button>
      </div>

      <h2 className="text-xl">TOASTS</h2>
      <TestToasts />

      <h2 className="text-xl">INPUTS</h2>
      <div className="flex flex-wrap gap-4">
        <div>
          <Input placeholder="Type your text here" />
        </div>
        <div>
          <Input placeholder="I'm disabled" disabled />
        </div>
        <div>
          <Input startContent={<IconSearch className="h-6 w-6" />} placeholder="With icon left" />
        </div>
        <div>
          <Input endContent={"$"} placeholder="Icon right" />
        </div>
        <div>
          <Input
            startContent={"$"}
            endContent={
              <div className="flex items-center">
                <label className="sr-only" htmlFor="currency">
                  Currency
                </label>
                <select
                  className="outline-none border-0 bg-transparent text-default-400 text-small"
                  id="currency"
                  name="currency"
                >
                  <option>USD</option>
                  <option>ARS</option>
                  <option>EUR</option>
                </select>
              </div>
            }
            placeholder="Both sides"
          />
        </div>

        <div>
          <Input error="This field is required" placeholder="There is an error" />
        </div>
      </div>
    </div>
  );
}
