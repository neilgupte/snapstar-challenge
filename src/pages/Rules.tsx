
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Camera, 
  FileImage, 
  Award, 
  Shield, 
  Copyright, 
  AlertTriangle, 
  Calendar, 
  Clock
} from 'lucide-react';

const RulesPage = () => {
  return (
    <div className="container max-w-4xl py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contest Rules & Guidelines</h1>
          <p className="mt-2 text-muted-foreground">
            Please read and follow these rules to participate in SnapStar photography contests
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-snapstar-purple" />
              <span>Photo Submission Rules</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p>To maintain quality and fairness, all photo submissions must adhere to these rules:</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-muted-foreground">Photos must be in JPEG or PNG format only</li>
                <li className="text-muted-foreground">Maximum file size is 10MB per photo</li>
                <li className="text-muted-foreground">Minimum resolution is 1600×1200 pixels</li>
                <li className="text-muted-foreground">Basic editing is allowed: exposure, contrast, white balance, and cropping</li>
                <li className="text-muted-foreground">No watermarks, frames, or borders are permitted</li>
                <li className="font-semibold">Photos must be taken during the active contest period</li>
                <li className="text-muted-foreground">Each participant can submit only one photo per contest</li>
                <li className="text-muted-foreground">Free users are limited to 3 submissions per week across all contests</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-snapstar-blue" />
              <span>Contest Timeline Requirements</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p className="font-semibold">All photographs must be taken during the active contest period</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-muted-foreground">EXIF data will be analyzed to verify the date the photo was taken</li>
                <li className="text-muted-foreground">Photos taken before the contest began will be automatically rejected</li>
                <li className="text-muted-foreground">Photos taken after the contest submission deadline will be automatically rejected</li>
                <li className="text-muted-foreground">The date and time settings on your camera should be accurate</li>
                <li className="text-muted-foreground">Photos without valid EXIF data may be subject to additional verification</li>
              </ul>
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex gap-2">
                <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800">
                  The timing restriction ensures all contestants have the same opportunity and encourages capturing fresh, original content specifically for each contest.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-snapstar-green" />
              <span>Editing & Manipulation Policies</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p>We allow basic post-processing while maintaining photographic integrity:</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-muted-foreground">Permitted: Adjustments to exposure, contrast, saturation, white balance</li>
                <li className="text-muted-foreground">Permitted: Cropping, straightening, lens correction</li>
                <li className="text-muted-foreground">Permitted: Black and white conversion</li>
                <li className="text-muted-foreground">Permitted: Removal of sensor dust spots</li>
                <li className="font-semibold text-snapstar-red">Not Permitted: Adding or removing elements</li>
                <li className="font-semibold text-snapstar-red">Not Permitted: Extensive alteration of colors/tones that change reality</li>
                <li className="font-semibold text-snapstar-red">Not Permitted: AI-generated or AI-altered images</li>
                <li className="font-semibold text-snapstar-red">Not Permitted: Composite images from multiple photographs</li>
              </ul>
              
              <p>Note: Some specialty contests may have different editing rules. Check the specific contest description for details.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="flex items-center gap-2">
              <Copyright className="h-5 w-5 text-snapstar-orange" />
              <span>Copyright & Ownership</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p>Regarding rights and ownership of submitted photographs:</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-muted-foreground">You must be the original creator of any photo you submit</li>
                <li className="text-muted-foreground">You must have all necessary rights to the image</li>
                <li className="text-muted-foreground">You retain copyright to all images you submit</li>
                <li className="text-muted-foreground">By submitting, you grant SnapStar limited rights to display your photo on our platform</li>
                <li className="text-muted-foreground">Winning photos may be featured in our promotional materials with attribution</li>
                <li className="text-muted-foreground">You are responsible for obtaining any necessary model or property releases</li>
              </ul>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex gap-2">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-blue-800">
                  We respect your rights as a photographer and will always provide proper attribution when featuring your work. You always maintain ownership of your photos.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span>Voting & Winner Selection</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p>How winners are determined:</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-muted-foreground">After submission period ends, all approved photos enter the voting phase</li>
                <li className="text-muted-foreground">Community members rate photos on a scale of 1-5 stars</li>
                <li className="text-muted-foreground">You cannot vote on your own photos</li>
                <li className="text-muted-foreground">Premium judges may provide additional ratings to selected photos</li>
                <li className="text-muted-foreground">Final scores are calculated using a weighted average system</li>
                <li className="text-muted-foreground">In case of ties, the photo with more total votes wins</li>
                <li className="text-muted-foreground">Contest organizers have final decision authority in disputes</li>
              </ul>
              
              <p>Winners are typically announced within 48 hours after the voting period ends.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Prohibited Content</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <p>The following types of content are not permitted:</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-muted-foreground">Obscene or explicit content</li>
                <li className="text-muted-foreground">Violent or disturbing imagery</li>
                <li className="text-muted-foreground">Content that promotes illegal activities</li>
                <li className="text-muted-foreground">Discriminatory or hateful content</li>
                <li className="text-muted-foreground">Content that infringes on others' rights</li>
                <li className="text-muted-foreground">Heavily watermarked or branded images</li>
                <li className="text-muted-foreground">Spam or misleading content</li>
                <li className="text-muted-foreground">Images showing unsafe or harmful practices</li>
              </ul>
              
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex gap-2">
                <Shield className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">
                  Violations of these content rules may result in removal of your submission and potential account restrictions.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="rounded-lg border p-4 bg-muted/30">
          <h3 className="text-lg font-semibold mb-2">Have Questions?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions about these rules or need clarification on specific points, please contact our support team.
          </p>
          <Button asChild>
            <Link to="/profile">Return to Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
