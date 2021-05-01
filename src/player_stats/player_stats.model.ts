export class PlayerStats {
    constructor(
        public id: number, 
        public meta: PlayerMetaData,
        public metaStats: PlayerMetaStats,
        public playlistStats: PlayerPlaylistStats
    ) { }
}

export class PlayerMetaData {
    constructor(
        public name: string, 
        public avatar: string, 
        public platform: string, 
        public pageviews: number
    ) { }
}

export class PlayerMetaStats {
    constructor(
        public wins: GenericMetaStats,
        public goalshotratio: GenericMetaStats,
        public goals: GenericMetaStats,
        public shots: GenericMetaStats,
        public assists: GenericMetaStats,
        public saves: GenericMetaStats,
        public mvps: GenericMetaStats,
    ) { }
}

export class PlayerPlaylistStats {
    constructor(
        public unranked: GenericPlaylistStats,
        public ranked1v1: GenericPlaylistStats,
        public ranked2v2: GenericPlaylistStats,
        public ranked3v3: GenericPlaylistStats,
        public hoops: GenericPlaylistStats,
        public rumble: GenericPlaylistStats,
        public dropshot: GenericPlaylistStats,
        public snowday: GenericPlaylistStats,
        public tournament: GenericPlaylistStats
    ) { }
}

export class GenericMetaStats {
    constructor(
        public name: string,
        public value: number,
        public percentile: number
    ) { }
}

export class GenericPlaylistStats {
    constructor(
        public playlistName: string,
        public tier: string,
        public division: string,
        public ratingValue: number,
        public ratingPercentile: number
    ) { }
}