import { AvatarCanvas } from "@/components/ThreeDCharacter";
import { NavigationMenu } from "@/components/NavigationMenu";
import { PageHeader } from "@/components/PageHeader";
import { Sparkles } from "lucide-react";

const Test3D = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/30 to-background relative overflow-hidden">
            <NavigationMenu />
            <PageHeader
                title="3D Avatar Preview"
                subtitle="Reference Prototype"
                icon={<Sparkles className="w-5 h-5 text-primary" />}
            />

            <main className="pt-24 pb-8 px-4 max-w-4xl mx-auto flex flex-col items-center gap-8">
                <div className="text-center">
                    <h2 className="font-serif text-2xl font-bold mb-2">Mikuu & Chakudi 3D Prototypes</h2>
                    <p className="text-muted-foreground">Proper 3D cartoons built with Three.js. You can rotate them!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="glass-card p-6 rounded-[2rem] flex flex-col items-center">
                        <h3 className="text-primary font-bold mb-4">Mikuu (3D)</h3>
                        <div className="bg-secondary/20 rounded-2xl w-full h-80">
                            <AvatarCanvas isGirl={true} />
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-[2rem] flex flex-col items-center">
                        <h3 className="text-primary font-bold mb-4">Chakudi (3D)</h3>
                        <div className="bg-secondary/20 rounded-2xl w-full h-80">
                            <AvatarCanvas isGirl={false} />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[2rem] border-2 border-primary/10 max-w-lg text-center mt-8">
                    <p className="text-foreground leading-relaxed">
                        This is the "Real Feel" 3D. They are actual 3D models rendered in real-time.
                        In the final versions for Hug and Kiss day, these characters will move, lean,
                        and interact with each other in this 3D space.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Test3D;
