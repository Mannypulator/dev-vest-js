"use client";

import { SERVER_URL } from "@/lib/constants";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";

const ShareButtons = ({ property }) => {
  const shareUrl = `${SERVER_URL}/properties/${property._id}`;
  const hashtag = property.type
    ? `#${property.type.replace(/\s/g, "")}ForRent`
    : "#PropertyForRent";

  return (
    <>
      <h3 className="text-xl font-bold text-center pt-2">
        Share This Property:
      </h3>
      <div className="flex gap-3 justify-center pb-5">
        <FacebookShareButton url={shareUrl} hashtag={hashtag}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={property.name || "Property Listing"}
          hashtags={[hashtag]}
        >
          <TwitterIcon size={40} round />
        </TwitterShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={property.name || "Property Listing"}
          separator=":: "
        >
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={property.name || "Property Listing"}
          body={`Check out this property listing: ${shareUrl}`}
        >
          <EmailIcon size={40} round />
        </EmailShareButton>
      </div>
    </>
  );
};

export default ShareButtons;
