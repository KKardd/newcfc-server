"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    extractDateOnly: function() {
        return extractDateOnly;
    },
    toDate: function() {
        return toDate;
    }
});
const extractDateOnly = (date)=>{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const toDate = (dateString)=>{
    const [year, month, day] = dateString.includes('T') ? dateString.split('T')[0].split('-').map(Number) : dateString.split('-').map(Number);
    if (!dateString.includes('T')) {
        const [year, month, day] = dateString.substring(0, 10).split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    return new Date(Date.UTC(year, month - 1, day));
};

//# sourceMappingURL=date.js.map