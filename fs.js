	function drFind(mmbr) {
		ret = ""
		if (ncdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
		for (i = 0; i <= mmbr.roles.map(r => r.name).length; i++) {
			if (ncdeproles.includes(mmbr.roles.map(r => r.name)[i])) {
				ret = mmbr.roles.map(r => r.name)[i]
			}
		}}
		if (cdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
		for (i = 0; i <= mmbr.roles.map(r => r.name).length; i++) {
			if (cdeproles.includes(mmbr.roles.map(r => r.name)[i])) {
				ret = ncdeproles[cdeproles.indexOf(mmbr.roles.map(r => r.name)[i])]
			}
		}}
		return ret
	}