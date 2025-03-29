
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: May 1, 2023</p>
        </div>
        
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p>
            At SnapStar, we take your privacy seriously. This Privacy Policy describes how we collect, use, and share your personal information when you use our platform.
          </p>
          
          <h2>1. Information We Collect</h2>
          <p>
            We collect the following types of information:
          </p>
          <ul>
            <li><strong>Account Information:</strong> When you create an account, we collect your email address, username, and password.</li>
            <li><strong>Age Verification:</strong> We collect your date of birth to verify that you meet our minimum age requirement.</li>
            <li><strong>Profile Information:</strong> We collect any information you provide in your profile, such as a bio or profile picture.</li>
            <li><strong>Content:</strong> We collect photos you upload and captions you write.</li>
            <li><strong>Usage Information:</strong> We collect information about how you use SnapStar, including contests you enter, votes you cast, and photos you view.</li>
            <li><strong>Device Information:</strong> We collect information about the device you use to access SnapStar, including IP address, browser type, and operating system.</li>
          </ul>
          
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your information for the following purposes:
          </p>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To authenticate your identity and maintain your account</li>
            <li>To enable your participation in contests</li>
            <li>To display your content to other users</li>
            <li>To send you notifications about contests and activity related to your account</li>
            <li>To moderate content and enforce our community guidelines</li>
            <li>To analyze usage and improve our service</li>
            <li>To respond to your questions and concerns</li>
          </ul>
          
          <h2>3. Information Sharing</h2>
          <p>
            We share your information in the following ways:
          </p>
          <ul>
            <li><strong>Public Content:</strong> Photos you submit to contests, your username, and profile are visible to other users.</li>
            <li><strong>Service Providers:</strong> We may share information with third-party service providers who help us operate SnapStar.</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect the rights, safety, or property of SnapStar, our users, or others.</li>
          </ul>
          
          <h2>4. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <h2>5. Children's Privacy</h2>
          <p>
            SnapStar is intended for users who are at least 12 years old. For users under 13, we collect only the minimal information necessary and require parental consent in compliance with COPPA (Children's Online Privacy Protection Act). Parents can review, delete, or refuse further collection of their child's information by contacting us.
          </p>
          
          <h2>6. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul>
            <li>The right to access the personal information we hold about you</li>
            <li>The right to correct inaccurate information</li>
            <li>The right to delete your information</li>
            <li>The right to restrict or object to processing</li>
            <li>The right to data portability</li>
          </ul>
          
          <h2>7. Changes to this Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
          
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@snapstar.com.
          </p>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button asChild>
            <Link to="/signup">Return to Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
