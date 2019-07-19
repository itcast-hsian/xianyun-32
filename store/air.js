
export const state = () => {
    return {
        // 机票的信息
        infoData: {
            seat_infos: {}
        }
    }
}

export const mutations = {
    // 设置机票的信息
    setInfoData( state, data ){
        state.infoData = data;
    }
}