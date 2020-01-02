export enum DocumentType {
    totalLoad = 'A65',
    windAndSolarForecast = 'A69',
    generationForecast = 'A71',
}

export enum ProcessType {
    dayAhead = 'A01',
    intraDayIncremental = 'A02',
}

export enum ParseType {
    solar = 'B16',
    windOnshore = 'B19',
    windOffshore = 'B18'
}
