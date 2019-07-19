
export const state = () => {
    return {
        // 机票的信息
        infoData: {
            seat_infos: {}
        },
        //  总价格
        allPrice: 0
    }
}

export const mutations = {
    // 设置机票的信息
    setInfoData( state, data ){
        state.infoData = data;
    },

    // 设置总价格
    setAllPrice( state, data ){
        state.allPrice = data;
    },
}