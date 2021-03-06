import moment from 'moment'

export const formatDateForDisplay = (date) => {
    if(!isNaN(new Date(date).getTime())){
        return moment(date).format('DD.MM.YYYY HH:mm:ss')
    }
}

export const formatDateForFileName = (date) => {
    if(!isNaN(new Date(date).getTime())){
        return moment(date).format('DD.MM.YYYY_HH:mm:ss')
    }
}

export const customDatePicker = (days) => {
    if(!isNaN(days)){
        var date = new Date();
        return date.setDate(date.getDate() - days);
    }
}

export const calculateDaysBetween = (startDate, endDate) => {
   return moment(startDate).diff(moment(endDate), 'days')
}
