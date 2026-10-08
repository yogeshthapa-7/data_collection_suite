export interface LoginDetail {
  clientcode: string
  app_type: string
  mainlogo: string
  mainTitle: string
  mainSubtitle: string
  logo: string
  mainHeading: string
  logo2: string
  logo3: string
  logo4: string
  Heading: string
  Heading2: string
  Heading3: string
  slogan: string
  dashTitle: string
  pageTitle: string
  landingPage: string
  furl: string
  uiurl: string
}

export const environment = {
  production: false,
  debugger: true,
  base_url: 'https://datacollection.kathmandu.gov.np:8080/',
  file_upload: 'https://maps.himalayankasturi.com.np/geojson/Upload',

  loginDetails: [
    {
      clientcode: 'kmc-dc',
      app_type: 'data_collection',
      mainlogo: '/assets/images/nepal_logo.png',
      mainTitle: 'काठमाडौं महानगरपालिका कार्यालय',
      mainSubtitle: 'Data Collection & Manipulation Portal',
      logo: '/assets/images/kmc_logo_transparent.png',
      mainHeading: 'काठमाडौं महानगरपालिका कार्यालय',
      logo2: '/assets/image/logo/kmc-logo.png',
      logo3: '/assets/images/nepal.gif',
      logo4: '/assets/images/logo/newari.png',
      Heading: 'Data Collection & Manipulation Portal ',
      Heading2: 'Dynamic Data Form',
      Heading3: '(Question Set)',
      slogan: 'स्वच्छ, सफा हराभरा बनाओ काठमाडौं महानगरपालिका',
      dashTitle: 'KMC Management',
      pageTitle: 'काठमाडौं महानगरपालिका कार्यालय',
      landingPage: 'kmc-dc',
      furl: 'https://datacollection.kathmandu.gov.np:8085/',
      uiurl: 'https://datacollection.kathmandu.gov.np:8085/',
    },
    // {
    //   clientcode: 'kmc-prj',
    //   app_type: 'project_management',
    //   mainlogo: '../assets/images/nepal_logo.png',
    //   mainTitle: 'काठमाडौं महानगरपालिका कार्यालय',
    //   mainSubtitle: 'Project Tracking',
    //   logo: '../assets/images/kmc_logo.jpg',
    //   mainHeading: 'काठमाडौं महानगरपालिका कार्यालय',
    //   logo2: '../assets/image/logo/kmc-logo.png',
    //   logo3: '../assets/images/nepal.gif',
    //   logo4: '../assets/image/logo/newari.png',
    //   Heading: 'Project Management Portal',
    //   Heading2: '',
    //   Heading3: '',
    //   slogan: '*"स्वच्छ, सफा हराभरा बनाओ काठमाडौं महानगरपालिका',
    //   dashTitle: 'KMC Management',
    //   pageTitle: 'काठमाडौं महानगरपालिका कार्यालय',
    //   landingPage: 'kmc-dc',
    //   furl: 'http://datacollection.kathmandu.gov.np:8085/',
    //   uiurl: 'http://datacollection.kathmandu.gov.np:8085/',
    // },
    // {
    //   clientcode: 'kmc-dc-local',
    //   app_type: 'data_collection',
    //   mainlogo: '../assets/images/nepal_logo.png',
    //   mainTitle: 'काठमाडौं महानगरपालिका कार्यालय',
    //   mainSubtitle: 'Data Collection & Manipulation Portal',
    //   logo: '../assets/images/kmc_logo.jpg',
    //   mainHeading: 'काठमाडौं महानगरपालिका कार्यालय',
    //   logo2: '../assets/image/logo/kmc-logo.png',
    //   logo3: '../assets/images/Flag_of_Nepal.gif',
    //   logo4: '../assets/images/logo/newari.png',
    //   Heading: 'Data Collection & Manipulation Portal ',
    //   Heading2: 'Dynamic Data Form',
    //   Heading3: '(Question Set)',
    //   slogan: '*"स्वच्छ, सफा हराभरा बनाओ काठमाडौं महानगरपालिका',
    //   dashTitle: 'KMC Management',
    //   pageTitle: 'काठमाडौं महानगरपालिका कार्यालय',
    //   landingPage: 'kmc-dc',
    //   furl: 'http://datacollection.kathmandu.gov.np:8085/',
    //   uiurl: 'http://datacollection.kathmandu.gov.np:8085/',
    // },
    // {
    //   clientcode: 'pbg',
    //   app_type: 'data_collection',
    //   mainlogo: '../assets/images/nepal_logo.png',
    //   mainTitle: 'बडीमालिका नगरपालिका कार्यालय',
    //   mainSubtitle: 'Data Collection & Manipulation Portal',
    //   mainHeading: 'बडीमालिका  नगरपालिका कार्यालय',
    //   logo: '../assets/images/logo/badimalika_new_logo.png',
    //   logo3: '../assets/images/Flag_of_Nepal.gif',
    //   Heading: '  एकीकृत स्थानीय तह वस्तुगत विवरण  ',
    //   Heading2: '   पारिवारिक विवरण संकलन फाराम',
    //   slogan: ' *"स्वच्छ, सफा हराभरा बनाओ बडीमालिका नगरपालिका ',
    //   dashTitle: 'Data Collection',
    //   pageTitle: 'बडीमालिका डिजिटल प्रोफाइल',
    //   landingPage: 'pbg',
    //   furl: 'https://admin.badimalika.pbg.com.np/',
    //   uiurl: 'https://admin.badimalika.pbg.com.np/',
    // },
    // {
    //   clientcode: 'kage',
    //   app_type: 'data_collection',
    //   mainlogo: '../assets/images/nepal_logo.png',
    //   mainTitle: 'कागेश्वरी मनोहरा नगरपालिका कार्यालय',
    //   mainSubtitle: 'Data Collection & Manipulation Portal',
    //   logo: '../assets/images/kage_logo.jpg',
    //   mainHeading: 'Data Collection & Reporting',
    //   logo3: '../assets/images/Flag_of_Nepal.gif',
    //   Heading: 'Data Collection & Manipulation Portal',
    //   Heading2: '',
    //   Heading3: '',
    //   slogan: 'स्वच्छ,सफा हराभरा, बनाऔँ कागेश्वरी मनोहरा',
    //   dashTitle: 'कागेश्वरी मनोहरा नगरपालिका कार्यालय',
    //   pageTitle: 'कागेश्वरी मनोहरा नगरपालिका कार्यालय',
    //   landingPage: 'kage',
    //   furl: 'http://kageshworiprofile.soft-acc.com/',
    //   uiurl: 'http://kageshworiprofile.soft-acc.com/',
    // },
    // {
    //   clientcode: 'kage-prj',
    //   app_type: 'project_management',
    //   mainlogo: '../assets/images/nepal_logo.png',
    //   mainTitle: 'कागेश्वरी मनोहरा नगरपालिकाको कार्यालय <br> बागमती प्रदेश, काठमाडौँ',
    //   mainSubtitle: 'Project Tracking System',
    //   logo: '../assets/images/kage_logo.jpg',
    //   mainHeading: 'Project Tracking System',
    //   logo3: '../assets/images/Flag_of_Nepal.gif',
    //   Heading: 'Project Tracking System',
    //   Heading2: 'Clock In Clock Out',
    //   Heading3: '',
    //   slogan: 'स्वच्छ,सफा हराभरा, बनाऔँ कागेश्वरी मनोहरा',
    //   dashTitle: 'कागेश्वरी मनोहरा नगरपालिकाकाे कार्यालय',
    //   pageTitle: 'कागेश्वरी मनोहरा नगरपालिका',
    //   landingPage: 'kage',
    //   furl: 'http://kageshworiprofile.soft-acc.com/',
    //   uiurl: 'http://kageshworiprofile.soft-acc.com/',
    // },
    // {
    //   clientcode: 'upcode',
    //   app_type: 'data_collection',
    //   mainlogo: '../assets/images/nepal_logo.png',
    //   mainTitle: 'Upcode Nepal',
    //   mainSubtitle: 'Project Tracking System',
    //   logo: '../assets/images/kage_logo.jpg',
    //   mainHeading: 'Project Tracking System',
    //   logo3: '../assets/images/Flag_of_Nepal.gif',
    //   Heading: 'Project Tracking System',
    //   Heading2: 'Clock In Clock Out',
    //   Heading3: '',
    //   slogan: 'Fall or Fly -- KEEP TRY !',
    //   dashTitle: 'Upcode Nepal Pvt. Ltd.',
    //   pageTitle: 'Upcode Nepal Pvt. Ltd.',
    //   landingPage: 'upcode',
    //   furl: 'http://kageshworiprofile.soft-acc.com/',
    //   uiurl: 'http://kageshworiprofile.soft-acc.com/',
    // },
    // {
    //   clientcode: 'dc-thakre',
    //   app_type: 'data_collection',
    //   localBodyLevel: 3,
    //   mainlogo: '../assets/images/thakre_logo.png',
    //   mainTitle: 'थाक्रे गाउँपालिकाको कार्यालय <br> बागमती प्रदेश, धादिङ, नेपाल',
    //   mainSubtitle: 'Data Collection System',
    //   logo: '../assets/images/thakre_logo.png',
    //   mainHeading: 'Data Collection System',
    //   logo2: '../assets/images/thakre_logo.png',
    //   logo3: '../assets/images/nepal.gif',
    //   Heading: 'Data Collection System',
    //   Heading2: '',
    //   Heading3: '',
    //   slogan: 'समृद्ध थाक्रे, सुखी थाक्रेबासी',
    //   dashTitle: 'थाक्रे गाउँपालिकाको कार्यालय',
    //   pageTitle: 'थाक्रे गाउँपालिकाको कार्यालय',
    //   landingPage: 'thakre',
    //   furl: 'https://digital-thakremun.himalayankasturi.com.np/',
    //   uiurl: 'https://digital-thakremun.himalayankasturi.com.np/',
    // },
  ] as LoginDetail[],

  client_code: 'kmc-dc',
}

export const getClientConfig = (): LoginDetail => {
  const clientCode = import.meta.env.VITE_CLIENT_CODE || environment.client_code
  const client = environment.loginDetails.find((item) => item.clientcode === clientCode)
  return client || environment.loginDetails[0]
}
