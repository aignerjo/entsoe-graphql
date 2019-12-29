export interface EntsoeDtoModel {
    GL_MarketDocument: {
        TimeSeries: {
            Period: {
                resolution: string;
                timeInterval: {
                    start: Date;
                    end: Date;
                }
                Point: [
                    {
                        position: number;
                        quantity: number
                    }
                    ]
            },
        },
    };
}
