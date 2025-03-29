
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Terms and Conditions</h1>
          <p className="text-muted-foreground">Last updated: May 1, 2023</p>
        </div>
        
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p>
            Welcome to SnapStar. By using our service, you agree to comply with and be bound by the following terms and conditions. Please review them carefully.
          </p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the SnapStar platform, you agree to be bound by these Terms and Conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>
          
          <h2>2. User Eligibility</h2>
          <p>
            You must be at least 12 years of age to use SnapStar. If you are under 13 years of age, you must have parental consent to use the service, in compliance with COPPA (Children's Online Privacy Protection Act).
          </p>
          
          <h2>3. Content Ownership and Licensing</h2>
          <p>
            By submitting a photo to a contest on SnapStar:
          </p>
          <ul>
            <li>You affirm that you own the rights to the image or have permission from the copyright holder</li>
            <li>You retain ownership of your content</li>
            <li>You grant SnapStar a non-exclusive, royalty-free license to display, promote, and feature your content on our platform and in promotional materials</li>
            <li>You represent that your content does not violate any third-party rights</li>
          </ul>
          
          <h2>4. Prohibited Content</h2>
          <p>
            Users may not upload content that:
          </p>
          <ul>
            <li>Contains nudity, pornography, or sexually explicit material</li>
            <li>Depicts violence, gore, or disturbing imagery</li>
            <li>Promotes discrimination, racism, or hate speech</li>
            <li>Infringes on intellectual property rights</li>
            <li>Contains illegal content or promotes illegal activities</li>
            <li>Violates the privacy rights of others</li>
          </ul>
          
          <h2>5. Contest Rules</h2>
          <p>
            All contests on SnapStar are governed by the following rules:
          </p>
          <ul>
            <li>Each user may submit only one photo per contest</li>
            <li>Submitted photos must comply with the specified contest theme and guidelines</li>
            <li>Winners are determined solely by user vote averages</li>
            <li>SnapStar reserves the right to disqualify entries that violate our terms</li>
            <li>Contest dates and times are final and binding</li>
          </ul>
          
          <h2>6. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify SnapStar immediately of any unauthorized use of your account.
          </p>
          
          <h2>7. Termination</h2>
          <p>
            SnapStar reserves the right to terminate or suspend your account and access to the service for violations of these terms, or for any other reason at our discretion.
          </p>
          
          <h2>8. Limitation of Liability</h2>
          <p>
            SnapStar shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
          </p>
          
          <h2>9. Changes to Terms</h2>
          <p>
            SnapStar reserves the right to modify these terms at any time. Your continued use of the platform following any changes constitutes your acceptance of the modified terms.
          </p>
          
          <h2>10. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at support@snapstar.com.
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

export default TermsAndConditions;
