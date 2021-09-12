const Page = require('./helpers/page');

let page;
beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});



describe('When logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });
    test('Can see Blog Create Form', async () => {

        const label = await page.getContentsOf('form label');
        expect(label).toEqual("Blog Title");
    });

    describe('And using valid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'My Title');
            await page.type('.content input', 'Some Content from test suite');
            await page.click('form button');
        });
        test('Submitting takes to review screen', async () => {
            const label = await page.getContentsOf('h5');
            expect(label).toEqual('Please confirm your entries')
        });
        test('Submitting then saving blog', async () => {
            await page.click('button.green');
            await page.waitFor('.card');
            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');
            expect(title).toEqual('My Title');
            expect(content).toEqual('Some Content from test suite')
        });
    });

    describe('And using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });

        test('the form shows an error message', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');

        });
    });




});

describe('User is not logged in', async () => {

    const actions = [
        { method: 'get', path: '/api/blogs' },
        { method: 'post', path: '/api/blogs', data: { title: 'T', content: 'C' } }
    ];

    // test('User cannot create blog post', async () => {
    //     const result = await page.post('/api/blogs', { title: 'T', content: 'C' });
    //     console.log(result);
    //     expect(result).toEqual({ error: 'You must log in!' });
    // });
    // test('User get the blog posts', async () => {
    //     const result = await page.get('/api/blogs');
    //     console.log(result);
    //     expect(result).toEqual({ error: 'You must log in!' });
    // });


    //Refactored code from above
    test('Blog related actions are prohibited', async () => {
        const results = await page.execRequests(actions);
        for (let result of results) {
            expect(result).toEqual({ error: 'You must log in!' });
        }
    });
});