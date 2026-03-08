import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { WarpBackground } from "./ui/warp-background";
import { Button } from "./ui/button";
import { EyeIcon } from "lucide-react";
import { Pencil } from "lucide-react";
export function DeployRapid() {
  return (
    <WarpBackground className="flex items-center justify-center w-full h-full p-6">
      <Card className="w-80">
        <CardContent className="flex flex-col gap-2 p-4">
          <CardTitle> Hurra, Din DPP-sida är publicerad! 🎉</CardTitle>
          <CardDescription>
            <div className="flex gap-2 mt-2 justify-center">
              <Button variant="default" size="sm">
                <EyeIcon />
                Visa
              </Button>
              <Button variant="default" size="sm">
                <Pencil />
                Redigera
              </Button>
            </div>
          </CardDescription>
        </CardContent>
      </Card>
    </WarpBackground>
  );
}
