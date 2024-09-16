import request from 'supertest';
import app from '../src/app';
import { validate as validateUUID } from 'uuid';

describe('GET /', () => {
  it('should return 200 and welcome message', async () => {
    const response = await request(app).get('/').send();
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Welcome to the Raisely API');
  });
});

describe('API endpoint /profiles', () => {
  let rootProfileId: string;
  let karanProfileId: string;
  let janeSmithDonationId: string;
  let markRussoDonationId: string;
  //POST - Create Root Campaign Profile successfully.
  it('should create new Root Campaign profile', async () => {
    const response = await request(app)
      .post('/profiles')
      .send({
        profile: {
          name: 'Campaign Profile',
          total: 0,
          parentId: null,
          currency: 'AUD',
        },
      })
      .expect('Content-Type', /json/);
    expect(response.status).toBe(201);
    expect(response.body.profile.name).toBe('Campaign Profile');
    expect(response.body.profile.total).toBe(0);
    expect(response.body.profile.parentId).toBe(null);
    expect(response.body.profile.currency).toBe('AUD');
    rootProfileId = response.body.profile.id;
    expect(validateUUID(rootProfileId));
  });
  // POST - Fail to create another Root Profile.
  it('should fail to create another Root Campaign profile', async () => {
    const response = await request(app)
      .post('/profiles')
      .send({
        profile: {
          name: 'Another Root Campaign Profile',
          total: 0,
          parentId: null,
          currency: 'AUD',
        },
      })
      .expect('Content-Type', /json/);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Campaign Root Profile already exists');
  });
  // POST - Create a USD Fund Raising profile.
  it('should create a USD Fund Raising profile', async () => {
    const response = await request(app)
      .post('/profiles')
      .send({
        profile: {
          name: "Karan's fund raising Profile",
          total: 0,
          parentId: rootProfileId,
          currency: 'USD',
        },
      })
      .expect('Content-Type', /json/);
    expect(response.status).toBe(201);
    expect(response.body.profile.name).toBe("Karan's fund raising Profile");
    expect(response.body.profile.total).toBe(0);
    expect(response.body.profile.parentId).toBe(rootProfileId);
    expect(response.body.profile.currency).toBe('USD');
    karanProfileId = response.body.profile.id;
    expect(validateUUID(karanProfileId));
  });
  // POST - Submit an Jane Smith AUD donation to Karan's Fund Raising Profile
  it('should submit Jane Smith AUD donation to Karan Fund Raising Profile', async () => {
    const response = await request(app)
      .post(`/profiles/${karanProfileId}/donations`)
      .send({
        donation: {
          donorName: 'Jane Smith',
          amount: 5000,
          profileId: karanProfileId,
          currency: 'AUD',
        },
      })
      .expect('Content-Type', /json/);
    expect(response.status).toBe(201);
    janeSmithDonationId = response.body.donation.id;
    expect(validateUUID(janeSmithDonationId));
  });
  // POST - Submit an Mark Russo EUR donation to Root Campaign Profile
  it('should submit Mark RUSSO EUR donation to Root Campaign Profile', async () => {
    const response = await request(app)
      .post(`/profiles/${rootProfileId}/donations`)
      .send({
        donation: {
          donorName: 'Mark RUSSO',
          amount: 1000,
          profileId: karanProfileId,
          currency: 'EUR',
        },
      })
      .expect('Content-Type', /json/);
    expect(response.status).toBe(201);
    markRussoDonationId = response.body.donation.id;
    expect(validateUUID(markRussoDonationId));
  });

  // Validate Profile total amounts are accurately update,
  // for tracking fundraising total's, in multiple currencies.
  it('should accurately tracking fundraising total amounts in multiple currencies', async () => {
    const response = await request(app).get(`/profiles`).send();
    expect(response.status).toBe(200);
    const rootProfile = response.body.profiles[0];
    const karanProfile = response.body.profiles[1];
    console.log(rootProfile);
    expect(rootProfile.total).toBe(5294.594594594595);
    expect(karanProfile.total).toBe(3700);
  });
});
