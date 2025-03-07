class KnowEmails {

    constructor(knowParser) {
        this.emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
        this.instance = knowParser;
    }

    main() {
        const lineList = this.instance.lines;
        const emails = [];

        for (let i = 0; i < lineList.length; i++) {
            const line = lineList[i];

            if (!/@.+\.(.)+$/.test(line)) {
                continue;
            }

            emails.push(...this.extractEmails(line));
        }

        return [...new Set(emails)];
    }

    extractEmails(query) {
        if (!query) {
            return [];
        }

        if (Array.isArray(query)) {
            query = query.join(" ");
        }

        if (!query.includes("@")) {
            return [];
        }

        const results = [];
        const match = query.match(this.emailRegex);
        if (match) {
            results.push(...match);
        }
        return results;
    }
}

module.exports = KnowEmails;
