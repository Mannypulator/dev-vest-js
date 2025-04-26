import {
  Bed,
  Bath,
  Ruler,
  X as Times,
  Check,
  MapPin as MapMarker,
} from "lucide-react";

const PropertyDetails = ({ property }) => {
  return (
    <main>
      <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
        <div className="text-gray-500 mb-4">{property?.type}</div>
        <h1 className="text-3xl font-bold mb-4">{property?.name}</h1>
        <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
          <MapMarker className="text-orange-700 mt-1 mr-1" />
          <p className="text-orange-700">
            {property?.location.street}, {property?.location.city}{" "}
            {property?.location.state}
          </p>
        </div>

        <h3 className="text-lg font-bold my-6  bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)] text-white p-2">
          Rates & Options
        </h3>
        <div className="flex flex-col md:flex-row justify-around">
          <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
            <div className="text-text-secondary mr-2 font-bold">Nightly</div>
            <div className="text-2xl font-bold text-primary">
              {property?.rates?.nightly ? (
                `$${property.rates.nightly.toLocaleString()}`
              ) : (
                <Times className="text-destructive" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
            <div className="text-text-secondary mr-2 font-bold">Weekly</div>
            <div className="text-2xl font-bold text-primary">
              {property?.rates?.weekly ? (
                `$${property.rates.weekly.toLocaleString()}`
              ) : (
                <Times className="text-destructive" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mb-4 pb-4 md:pb-0">
            <div className="text-text-secondary mr-2 font-bold">Monthly</div>
            <div className="text-2xl font-bold text-primary">
              {property?.rates?.monthly ? (
                `$${property.rates.monthly.toLocaleString()}`
              ) : (
                <Times className="text-destructive" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Description & Details</h3>
        <div className="flex justify-center gap-4 text-black-500 mb-4 text-xl space-x-9">
          <p>
            <Bed color="#E6B027" className="inline-block mr-2" />{" "}
            {property?.beds} <span className="hidden sm:inline">Beds</span>
          </p>
          <p>
            <Bath color="#E6B027" className="inline-block mr-2" />{" "}
            {property?.baths} <span className="hidden sm:inline">Baths</span>
          </p>
          <p>
            <Ruler color="#E6B027" className="inline-block mr-2" />
            {property?.squareFeet}{" "}
            <span className="hidden sm:inline">sqft</span>
          </p>
        </div>
        <p className="text-gray-500 mb-4">{property?.description}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Amenities</h3>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none space-y-2">
          {property?.amenities.map((amenity, index) => (
            <li key={index}>
              <Check className="inline-block text-green-600 mr-2" /> {amenity}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Property Tour</h3>
        {property?.videoUrl ? (
          <video
            className="w-full rounded-lg"
            controls
            poster={property.images?.[0]} // Optional: shows thumbnail from first image
          >
            <source src={property.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-gray-500 italic">
            No video tour available for this property.
          </p>
        )}
      </div>
    </main>
  );
};

export default PropertyDetails;
