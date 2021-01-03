// const { TestScheduler } = require('jest')
// const captureService = require('../captureService')

// describe('captureService.hasDates', () => {
//     const ds = ['1999-11-05', '1999-11-26', '1999-12-31', '20xx-xx-xx', '20XX-XX-XX'];
//     for (const d of ds) {
//         it(`has ${d}`, () => {
//             expect(captureService.hasDate(d)).toBe(true)
//         })
//     }

//     test('does not have 1992-11-25', () => {
//         expect(captureService.hasDate('1992-11-25')).toBe(false)
//     })

//     test('does not have 1999-11-055', () => {
//         expect(captureService.hasDate('1999-11-055')).toBe(false)
//     })
// })

// describe('captureService.getDates', () => {
//     const ds = ['1999-11-05', '1999-11-26', '1999-12-31', '20XX-XX-XX'];
//     const r = captureService.getDates();
//     it(`has ${ds.length} elements`, () => {
//         expect(r.length).toBe(ds.length)
//     })

//     ds.forEach(d => {
//         it(`has ${d}`, () => {
//             expect(r).toContain(d);
//         })
//     })
// })

// describe('captureService.getCaptureByDate', () => {
//     const ds = ['1999-11-05', '1999-11-26', '1999-12-31', '20XX-XX-XX'];
//     ds.forEach(d => {
//         const r = captureService.getCaptureByDate(d);
//         it(`${d} has correct date`, () => {
//             expect(r).toHaveProperty('date', d);
//         })

//         it(`${d} has >1 pages`, () => {
//             expect(r).toHaveProperty('pages')
//             expect(r.pages.length).toBeGreaterThan(1)
//         })

//         it(`${d} has >1 links`, () => {
//             expect(r).toHaveProperty('links')
//             expect(r.links.length).toBeGreaterThan(1)
//         })
//     })
// })

