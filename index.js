require("dotenv").config();
const hubspot = require("@hubspot/api-client");
const hubspotClient = new hubspot.Client({ apiKey: process.env.HS_API_KEY });

// ------------------------------------- Basic -------------------------------------
const createContact = async () => {
  try {
    const contactInfo = {
      properties: {
        company: "Biglytics",
        email: "bcooper@biglytics.net",
        firstname: "Bryan",
        lastname: "Cooper",
        phone: "(877) 929-0687",
        website: "biglytics.net",
      },
    };
    const { body: newContact } = await hubspotClient.crm.contacts.basicApi.create(contactInfo);
    console.log(newContact);
  } catch (error) {
    console.error(error);
  }
};
// createContact();

const listContacts = async () => {
  try {
    const allContacts = await hubspotClient.crm.contacts.getAll();
    console.log(allContacts.length);
    return allContacts;
  } catch (error) {
    console.error(error);
  }
};
// listContacts();

const getContact = async (email = "oclemendot2@ca.gov") => {
  try {
    const { body: contact } = await hubspotClient.crm.contacts.basicApi.getById(
      email,
      undefined,
      undefined,
      undefined,
      "email"
    );
    return contact;
  } catch (error) {
    console.error(error);
  }
};
// getContact();

const updateContact = async () => {
  try {
    const { body: contact } = await hubspotClient.crm.contacts.basicApi.getById(
      "oclemendot2@ca.gov",
      undefined,
      undefined,
      undefined,
      "email"
    );
    console.log(contact);
  } catch (error) {
    console.error(error);
  }
};
// getContact();

const archiveContact = async () => {
  try {
    const contact = await getContact();
    await hubspotClient.crm.contacts.basicApi.archive(contact.id);
    console.log(`${contact.properties.firstname} has been deleted.`);
    console.log();
  } catch (error) {
    console.error(error);
  }
};
// archiveContact();

// ------------------------------------- Search -------------------------------------
const searchContacts = async () => {
  try {
    const filter = { propertyName: "createdate", operator: "GTE", value: Date.now() - 30 * 60000 };
    const filterGroup = { filters: [filter] };
    const sort = JSON.stringify({ propertyName: "createdate", direction: "DESCENDING" });
    const query = "test";
    const properties = ["createdate", "firstname", "lastname"];
    const limit = 100;
    const after = 0;

    const publicObjectSearchRequest = {
      filterGroups: [filterGroup],
      sorts: [sort],
      query,
      properties,
      limit,
      after,
    };

    const result = await hubspotClient.crm.contacts.searchApi.doSearch(publicObjectSearchRequest);
    console.log(JSON.stringify(result.body));
  } catch (error) {
    console.error(error);
  }
};
// searchContacts();

// ------------------------------------- Associations -------------------------------------
const associateContact = async () => {
  try {
    const companyObj = {
      properties: {
        domain: "dennyh.me",
        name: "denny llc",
      },
    };
    const createCompanyResponse = await hubspotClient.crm.companies.basicApi.create(companyObj);

    const contact = await getContact("ocroisier7@ifeng.com");

    const { body: accociation } = await hubspotClient.crm.contacts.associationsApi.create(
      contact.id,
      "companies",
      createCompanyResponse.body.id,
      "contact_to_company"
    );

    console.log(accociation);
  } catch (error) {
    console.error(error);
  }
};
// associateContact();

const listAssociations = async () => {
  try {
    const contact = await getContact("ocroisier7@ifeng.com");
    const { body: accociation } = await hubspotClient.crm.contacts.associationsApi.getAll(
      contact.id,
      "companies"
    );
    console.log(accociation);
  } catch (error) {
    console.error(error.message);
  }
};
// listAssociations();

const removeAssociation = async () => {
  try {
    const contact = await getContact("ocroisier7@ifeng.com");
    await hubspotClient.crm.contacts.associationsApi.archive(
      contact.id,
      "companies",
      "4909372467",
      "contact_to_company"
    );
    console.log(`${contact.properties.firstname}'s asscoation is archived.`);
  } catch (error) {
    console.error(error.message);
  }
};
// removeAssociation();

// ------------------------------------- Batch -------------------------------------
const batchArchive = async () => {
  try {
    const threeIdsToArchive = (await listContacts())
      .map((contact) => ({ id: contact.id }))
      .slice(0, 3);

    await hubspotClient.crm.contacts.batchApi.archive({ inputs: threeIdsToArchive });
  } catch (error) {
    console.error(error);
  }
};
// batchArchive();

const batchCreateContacts = async () => {
  try {
    const newContactsInfo = [
      {
        company: "Gabtune",
        firstname: "Hewitt",
        lastname: "Burleton",
        email: "hburleton0@vistaprint.com",
        phone: "285-116-2845",
      },
      {
        company: "Eimbee",
        firstname: "Adam",
        lastname: "Fogarty",
        email: "afogarty1@timesonline.co.uk",
        phone: "679-437-5454",
      },
      {
        company: "Chatterbridge",
        firstname: "Skye",
        lastname: "Schimmang",
        email: "sschimmang2@amazon.co.uk",
        phone: "447-300-2180",
      },
      {
        company: "Voonyx",
        firstname: "Melessa",
        lastname: "Dudill",
        email: "mdudill3@hexun.com",
        phone: "687-884-8033",
      },
      {
        company: "Photolist",
        firstname: "Karyn",
        lastname: "Joreau",
        email: "kjoreau4@hatena.ne.jp",
        phone: "985-821-4830",
      },
      {
        company: "Youbridge",
        firstname: "Floyd",
        lastname: "Costain",
        email: "fcostain5@eventbrite.com",
        phone: "110-388-8807",
      },
      {
        company: "Tagfeed",
        firstname: "Al",
        lastname: "Graser",
        email: "agraser6@opera.com",
        phone: "107-160-9306",
      },
      {
        company: "Photobug",
        firstname: "Harriette",
        lastname: "Cornbell",
        email: "hcornbell7@biglobe.ne.jp",
        phone: "139-345-4917",
      },
      {
        company: "Mydo",
        firstname: "Ranna",
        lastname: "Frise",
        email: "rfrise8@businessinsider.com",
        phone: "378-455-6814",
      },
      {
        company: "Innotype",
        firstname: "Gerik",
        lastname: "Ferrar",
        email: "gferrar9@harvard.edu",
        phone: "259-391-8209",
      },
    ].map((c) => ({ properties: c }));

    const data = await hubspotClient.crm.contacts.batchApi.create({ inputs: newContactsInfo });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
// batchCreateContacts();

const batchReadContacts = async () => {
  try {
    const fiveContactsToRead = (await listContacts())
      .map((contact) => ({ id: contact.properties.email }))
      .slice(0, 5);

    const { body: contacts } = await hubspotClient.crm.contacts.batchApi.read({
      inputs: fiveContactsToRead,
      idProperty: "email",
    });
    console.log(contacts);
  } catch (error) {
    console.error(error);
  }
};
batchReadContacts();
