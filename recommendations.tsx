import { RecommendationForm } from "@/components/ai/recommendation-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function RecommendationsPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                    Personalized Recommendations
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Describe your health goals or preferences, and our AI herbalist will suggest plants that might be beneficial for you.
                </p>
            </div>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">What are you looking for?</CardTitle>
                    <CardDescription>
                        For example: "I'm looking for plants that can help with stress and anxiety" or "Herbs that can support digestion."
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RecommendationForm />
                </CardContent>
            </Card>

            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>
                    The information provided is for educational purposes only and is not a substitute for professional medical advice. Always consult with a healthcare provider before using any herbal remedies.
                </AlertDescription>
            </Alert>
        </div>
    );
}
