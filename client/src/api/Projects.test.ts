import { SecondsToTimeSpan, TimeSpanToSeconds } from './Projects';

it('Converts from milliseconds', () => {
    expect(SecondsToTimeSpan(0.05)).toEqual('00:00:00.05');
});

it('Converts from seconds', () => {
    expect(SecondsToTimeSpan(5)).toEqual('00:00:05');
});

it('Converts from minutes', () => {
    expect(SecondsToTimeSpan(5 * 60)).toEqual('00:05:00');
});

it('Converts from hours', () => {
    expect(SecondsToTimeSpan(5 * 60 * 60)).toEqual('05:00:00');
});

it('Converts from days', () => {
    expect(SecondsToTimeSpan(5 * 24 * 60 * 60)).toEqual('5.00:00:00');
});

it('Converts to milliseconds', () => {
    expect(TimeSpanToSeconds('00:00:00.05')).toEqual(0.05);
});

it('Converts to seconds', () => {
    expect(TimeSpanToSeconds('00:00:05')).toEqual(5);
})

it('Converts to minutes', () => {
    expect(TimeSpanToSeconds('00:05:00')).toEqual(5 * 60);
})

it('Converts to hours', () => {
    expect(TimeSpanToSeconds('05:00:00')).toEqual(5 * 60 * 60);
})

it('Converts to days', () => {
    expect(TimeSpanToSeconds('5.00:00:00')).toEqual(5 * 24 * 60 * 60);
})

