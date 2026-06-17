import React, { useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";

export default function StoreLocation() {
  const [isHovering, setIsHovering] = useState(false);
  const directionsUrl =
    "https://www.google.com/maps/search/?api=1&query=30.374390449846995,-9.534419524821482";

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Nous Visiter
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-4">
            Trouvez-Nous à Agadir
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Explorez notre collection premium d'accessoires technologiques en personne. Visitez
            notre magasin phare pour découvrir les derniers produits et obtenir des conseils
            d'experts.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-12">
          {/* Left Column - Store Info */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Store Details Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Magasin Atlas.Tech</h3>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                    Localisation
                  </p>
                  <p className="text-base text-slate-900 font-medium">Agadir, Maroc</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                    Horaires
                  </p>
                  <div className="space-y-1">
                    <p className="text-base text-slate-900">Lun - Ven : 9:00 - 20:00</p>
                    <p className="text-base text-slate-900">Sam : 10:00 - 21:00</p>
                    <p className="text-base text-slate-900">Dim : 11:00 - 19:00</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                    Contact
                  </p>
                  <p className="text-base text-blue-600 font-medium hover:text-blue-700 transition-colors">
                    +212 606-539113
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-700">Consultation d'experts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-700">Essayez avant d'acheter</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-700">Retrait le même jour</span>
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-2">
            <div
              className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 transition-all duration-300 hover:shadow-2xl group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                boxShadow: isHovering
                  ? "0 25px 50px rgba(0, 0, 0, 0.15)"
                  : "0 10px 30px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 pointer-events-none transition-all duration-300 group-hover:from-black/5 group-hover:to-black/0"></div>

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d6884.349843717122!2d-9.534419524821482!3d30.374390449846995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sar!2sma!4v1781641114212!5m2!1sar!2sma"
                style={{
                  width: "100%",
                  height: "500px",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12)",
                  display: "block",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation du magasin Atlas.Tech à Agadir"
              />

              {/* Hover Effect Badge */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-medium text-slate-900">Cliquez pour ouvrir dans Maps</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 border-t border-slate-100">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-600/30 active:scale-95 text-center overflow-hidden"
          >
            {/* Background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <span className="relative flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Obtenir les directions
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>

          <button className="px-8 py-4 border-2 border-slate-300 text-slate-900 font-semibold rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all duration-300">
            Appeler le magasin
          </button>
        </div>
      </div>
    </section>
  );
}
