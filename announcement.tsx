import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

const announcements = [
  {
    title: "Virtual Workshop: Introduction to Ayurvedic Herbs",
    date: "October 26, 2024",
    location: "Online (Zoom)",
    description: "Join us for a free virtual workshop where we'll explore the fundamentals of Ayurveda and introduce you to five essential herbs for your home wellness kit.",
    tags: ["Workshop", "Ayurveda", "Free"],
  },
  {
    title: "Community Garden Meetup",
    date: "November 5, 2024",
    location: "Greenwood Community Park",
    description: "Our first in-person meetup! Come meet fellow AYUSH enthusiasts, share gardening tips, and participate in a guided tour of the park's medicinal plant section.",
    tags: ["Meetup", "Community", "In-Person"],
  },
  {
    title: "Webinar: The Science of Adaptogens",
    date: "November 18, 2024",
    location: "Online",
    description: "Dive deep into the science behind adaptogenic herbs like Ashwagandha and Tulsi with Dr. Anjali Sharma. Learn how they help the body manage stress.",
    tags: ["Webinar", "Science", "Adaptogens"],
  },
  {
    title: "New Plant Added: Giloy!",
    date: "December 1, 2024",
    location: "AYUSH Garden App",
    description: "We've just added Giloy (Tinospora cordifolia) to our virtual garden. Explore its uses, benefits, and rich history in traditional medicine.",
    tags: ["App Update", "New Plant"],
  },
];


export default function AnnouncementsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                    Announcements & Events
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Stay up-to-date with the latest news, workshops, and community events from the world of AYUSH.
                </p>
            </div>

            <div className="space-y-6">
                {announcements.map((item, index) => (
                    <Card key={index} className="transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">{item.title}</CardTitle>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{item.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{item.location}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>{item.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
