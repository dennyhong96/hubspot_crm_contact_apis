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
