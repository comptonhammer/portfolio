//@ts-check

function sortDashNewOldDead(leads, page = 0, limit = 25){
    let sorted = leads;
    sorted.sort((a, b) => {
        if(a.stats.dead) 
            return 1;
        if(b.stats.dead) 
            return -1;
        if(a.stats.consult_scheduled) 
            return 1;
        if(b.stats.consult_scheduled) 
            return -1;
        else{
            let aDate = new Date(a.added);
            let bDate = new Date(b.added);
            if(aDate < bDate) 
                return 1;
            else if(aDate > bDate) 
                return -1;
            else 
                return 0;
        }
    })
    return sorted.slice(page*limit, page*limit + limit);
}

function sortArchiveNewOld(leads){
    let sorted = leads;
    sorted.sort(() => 1); // Just flips it
    return sorted;
}

function getUserStats(user){
    let data = {};

    let thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let total = 0;
    let scheduled = 0;
    for(let i = 0; i < user.leads.length; i++){
        let added = new Date(user.leads[i].added);
        if(added >= thirtyDaysAgo){
            total++;
            if(user.leads[i].stats.consult_scheduled) 
                scheduled++;
        }
    }
    data.scheduled = [scheduled, total - scheduled];

    total = 0;
    let dead = 0;
    for(let i = 0; i < user.leads.length; i++){
        let added = new Date(user.leads[i].added);
        if(added >= thirtyDaysAgo){
            total++;
            if(user.leads[i].stats.dead) dead++;
        }
    }
    data.dead = [dead, total - dead];

    return data;
}

function createLeadViewAttr(user){
    let attr = {
        username: user.username,
        active: { // Which tab is active
            dash: {
                css: '',
                includeFeatures: false // Bolds 'Home' tab and includes 'Integrations' button if true
            }, 
            cell: {
                css:'' 
            },
            archive:{
                css:''
            },
            stats:{
                css:''
            },
            buy:{
                css:''
            },
            account:{
                css:''
            }
        },
        account:{
            remainingLeads: user.data.account.max,
            usedLeads: user.data.account.used,
            org_code: user.organization_code
        },
        apis:{
            pipedrive: {
                token: user.pipedrive,
                redirUrl: process.env.PD_REDIRECT_URI,
                clientId: process.env.PD_CONSUMER_KEY
            },
            salesforce: {
                token: user.salesforce,
                redirUrl: process.env.SF_REDIRECT_URI,
                clientId: process.env.SF_CONSUMER_KEY
            }
        }
    };
    return attr;
}

module.exports = {
    sortDashNewOldDead,
    createLeadViewAttr,
    sortArchiveNewOld,
    getUserStats
}