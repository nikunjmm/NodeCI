const Page = require('./helpers/page');

let page;
beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});

test('Header has correct text', async () => {
    await page.waitFor('a.brand-logo');
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toEqual("Blogster");
});

test('clicking login starts oauth flow', async () => {
    await page.click('.right a');
    const pageUrl = await page.url();
    console.log(pageUrl);
    expect(pageUrl).toMatch(/accounts\.google\.com/);
});

test('When signed in show logout button', async () => {
    //const userId = "613840fadba4461df0241204";
    await page.login();
    await page.waitFor('a[href="/auth/logout"]');
    const text = await page.getContentsOf('a[href="/auth/logout"]');
    expect(text).toEqual("Logout");
});

