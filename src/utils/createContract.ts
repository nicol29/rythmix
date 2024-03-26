import { LicenseTermsInterface } from "@/types/mongoDocTypes";


export const createContract = (
  licenseTerms: LicenseTermsInterface, 
  producerUserName: string, 
  artistUserName: string,
  beatTitle: string,
  beatPrice: number,
  activeLicense: "basic" | "premium" | "exclusive",
) => {
  const dayjs = require('dayjs');
  
  const currentDate = dayjs().format('DD/MM/YYYY');

  return `
BEAT LICENSE AGREEMENT

This Beat License Agreement ("Agreement") is entered into as of ${currentDate} ("Effective Date"), between ${producerUserName}, herein referred to as the "Licensor," and ${artistUserName}, herein referred to as the "Licensee."

WHEREAS, Licensor owns and controls the rights to the instrumental music track titled ${beatTitle} ("Beat"); and

WHEREAS, Licensee wishes to obtain certain rights to use the Beat in accordance with the terms and conditions of this Agreement;

NOW, THEREFORE, in consideration of the mutual promises contained herein and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

License Grant: Licensor hereby grants to Licensee a ${activeLicense !== "exclusive" ? "non-exclusive" : "exclusive"}, worldwide license to use the Beat subject to the terms and conditions of this Agreement. This license permits the Licensee to:

a. Distribute up to ${licenseTerms.distributionCopies} copies of the Beat as part of a song or audio project.

b. Use the Beat for up to ${licenseTerms.audioStreams} audio streams on platforms including, but not limited to, Spotify, Apple Music, and YouTube.

c. Create and distribute one ${licenseTerms.musicVideos} music video utilizing the Beat.

d. Use the Beat for broadcasting on up to one ${licenseTerms.radioStations} radio station.

e. ${licenseTerms.allowProfitPerformances ? "Conduct live performances with the Beat that may generate profit." : "Live performances are not permitted with the Beat that may generate profit."}

Territory: The rights granted to the Licensee shall apply globally, unless the country is specifically excluded in the terms of this Agreement.

Credit: Licensee agrees to credit the Licensor in any written description accompanying the published song in the format: "Produced by ${producerUserName}."

Restrictions: The Licensee shall not sell, lease, license, or sub-license the Beat, except as part of a musical composition. The Beat remains the intellectual property of the Licensor.

Term: The rights granted to the Licensee under this Agreement shall commence on the Effective Date and shall continue perpetually unless otherwise terminated in accordance with this Agreement.

Payment: Licensee agrees to pay Licensor a one-time fee of ${beatPrice} for the rights granted under this Agreement. The payment shall be made in full before the Beat is used by the Licensee.

Warranties and Representations: Licensor warrants that they have the right and authority to enter into this Agreement and grant the rights herein.

Termination: This Agreement may be terminated by either party if the other party breaches any of its terms and conditions.

Governing Law: This Agreement shall be governed by the laws of [State/Country].

IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.


Name: ${producerUserName}
Date: ${currentDate}

Name: ${artistUserName}
Date: ${currentDate}
`
}