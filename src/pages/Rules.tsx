
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Rules = () => {
  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">SnapStar Contest Rules</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📝 General Contest Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Welcome to SnapStar! These rules apply to all photography contests on our platform. Please read them carefully before participating.</p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="age-requirement">
              <AccordionTrigger>Age Requirement</AccordionTrigger>
              <AccordionContent>
                <p>All participants must be 12 years of age or older. Users under 18 should have parental permission to enter contests.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="eligibility">
              <AccordionTrigger>Eligibility</AccordionTrigger>
              <AccordionContent>
                <p>Contests are open to amateur and professional photographers worldwide, unless specified otherwise in the specific contest rules.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="submission-limit">
              <AccordionTrigger>Submission Limits</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Free users can submit up to 3 photos per week across all contests.</li>
                  <li>Premium users have unlimited submissions.</li>
                  <li>Each user may submit a maximum of 2 photos per individual contest, unless stated otherwise.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="original-content">
              <AccordionTrigger>Original Content</AccordionTrigger>
              <AccordionContent>
                <p>All submitted photographs must be the original work of the contestant. By submitting an entry, you confirm that you are the sole creator and copyright holder of the image.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="copyright">
              <AccordionTrigger>Copyright and Usage Rights</AccordionTrigger>
              <AccordionContent>
                <p>Photographers retain copyright of their images. By entering, you grant SnapStar a non-exclusive, worldwide, royalty-free license to use your submitted images for promotional purposes related to the contest.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📸 Photo Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="file-format">
              <AccordionTrigger>File Format and Size</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Accepted formats: JPEG, PNG</li>
                  <li>Maximum file size: 20MB</li>
                  <li>Minimum resolution: 1920 pixels on the longest side</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="editing">
              <AccordionTrigger>Photo Editing</AccordionTrigger>
              <AccordionContent>
                <p>Basic editing is allowed, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Adjustments to exposure, contrast, saturation</li>
                  <li>Cropping and straightening</li>
                  <li>Noise reduction and sharpening</li>
                </ul>
                <p className="mt-2">Excessive manipulation that alters the authenticity of the image is not permitted, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Adding or removing significant elements</li>
                  <li>Compositing multiple images</li>
                  <li>Digital art that does not maintain the integrity of the original photograph</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="watermarks">
              <AccordionTrigger>Watermarks</AccordionTrigger>
              <AccordionContent>
                <p>Images should not contain watermarks, borders, signatures, or other identifying text. SnapStar will display proper attribution with all photos.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🏆 Voting and Winners</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="voting-process">
              <AccordionTrigger>Voting Process</AccordionTrigger>
              <AccordionContent>
                <p>After the submission period ends, entries enter a voting phase where:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All registered users can vote on submissions</li>
                  <li>Each user can rate photos on a scale of 1-5 stars</li>
                  <li>Users cannot vote on their own submissions</li>
                  <li>Voting typically lasts 7 days after the submission deadline</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="winner-selection">
              <AccordionTrigger>Winner Selection</AccordionTrigger>
              <AccordionContent>
                <p>Winners are determined by:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Highest average rating (minimum 5 votes required)</li>
                  <li>In case of a tie, the photo with more votes wins</li>
                  <li>If still tied, contest judges will select the winner</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="prizes">
              <AccordionTrigger>Prizes</AccordionTrigger>
              <AccordionContent>
                <p>Prizes vary by contest and may include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Featured placement on SnapStar homepage and social media</li>
                  <li>SnapStar Premium membership</li>
                  <li>Photography equipment and gift cards (for sponsored contests)</li>
                  <li>Exhibition opportunities (for special events)</li>
                </ul>
                <p className="mt-2">Specific prizes will be listed in each contest description.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>⚠️ Disqualification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Entries may be disqualified for the following reasons:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Content violating our community guidelines (inappropriate, offensive, or illegal content)</li>
            <li>Images that aren't the original work of the participant</li>
            <li>Excessive manipulation beyond the allowed editing guidelines</li>
            <li>Evidence of vote manipulation or fraudulent activities</li>
            <li>Submission does not follow the specific contest theme or requirements</li>
          </ul>
          <p className="mt-4">SnapStar reserves the right to disqualify any entry at its discretion and to modify these rules as needed. Any rule changes will be announced in advance.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rules;
