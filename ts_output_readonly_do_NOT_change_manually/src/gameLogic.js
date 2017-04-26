var gameService = gamingPlatform.gameService;
var alphaBetaService = gamingPlatform.alphaBetaService;
var translate = gamingPlatform.translate;
var resizeGameAreaService = gamingPlatform.resizeGameAreaService;
var log = gamingPlatform.log;
var dragAndDropService = gamingPlatform.dragAndDropService;
var gameLogic;
(function (gameLogic) {
    gameLogic.score = { first: 0, second: 0 };
    function putScoreOne(first) {
        return { first: first, second: 0 };
    }
    gameLogic.putScoreOne = putScoreOne;
    gameLogic.ROWS = 4;
    gameLogic.COLS = 4;
    function getInitialBoard() {
        var board = [];
        var diceArr = [
            [
                ['A', 'A', 'C', 'I', 'O', 'T'],
                ['A', 'H', 'M', 'O', 'R', 'S'],
                ['E', 'G', 'K', 'L', 'U', 'Y'],
                ['A', 'B', 'I', 'L', 'T', 'Y']
            ],
            [
                ['A', 'C', 'D', 'E', 'M', 'P'],
                ['E', 'G', 'I', 'N', 'T', 'V'],
                ['G', 'I', 'L', 'R', 'U', 'W'],
                ['E', 'L', 'P', 'S', 'T', 'U']
            ],
            [
                ['D', 'E', 'N', 'O', 'S', 'W'],
                ['A', 'C', 'E', 'L', 'R', 'S'],
                ['A', 'B', 'J', 'M', 'O', 'Qu'],
                ['E', 'E', 'F', 'H', 'I', 'Y']
            ],
            [
                ['E', 'H', 'I', 'N', 'P', 'S'],
                ['D', 'K', 'N', 'O', 'T', 'U'],
                ['A', 'D', 'E', 'N', 'V', 'Z'],
                ['B', 'I', 'F', 'O', 'R', 'X']
            ]
        ];
        var curArr = [];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            board[i] = [];
            for (var j = 0; j < gameLogic.COLS; j++) {
                var ran = Math.floor((Math.random() * 5));
                board[i][j] = diceArr[i][j][ran];
                log.info([ran, i, j, board[i][j][j]]);
                console.log(diceArr[i][ran]);
            }
        }
        return board;
    }
    gameLogic.getInitialBoard = getInitialBoard;
    function getInitialState() {
        return {
            chosenBoard: getInitialBoard(), guessList: []
        };
    }
    gameLogic.getInitialState = getInitialState;
    function createInitialMove() {
        return {
            endMatchScores: null, turnIndex: 0,
            state: getInitialState() ///returns initial board
        };
    }
    gameLogic.createInitialMove = createInitialMove;
    function getWinner() {
    }
    function createMove(board, stateBeforeMove, turnIndexBeforeMove) {
        //if (!stateBeforeMove) {
        //stateBeforeMove = getInitialState();
        //}
        var winner = getWinner();
        var chosenBoard = board;
        var guessList = [];
        console.log("this is createMove");
        var turnIndexAfterMove = 1 - turnIndexBeforeMove;
        var boardAfterMove = angular.copy(chosenBoard);
        var endMatchScores; // = [stateBeforeMove.guessList.length];
        var turnIndex;
        var delta = { board: chosenBoard, guessList: guessList };
        var state = { chosenBoard: chosenBoard, guessList: guessList };
        return {
            endMatchScores: endMatchScores,
            turnIndex: turnIndexAfterMove,
            state: state,
        };
    }
    gameLogic.createMove = createMove;
    //export let wordList = ('a,vor,vol,voe,vly,vis,vin,vim,vig,vie,vid,via,vex,abs,vet,veg,vee,vaw,vav,vau,vat,vas,var,van,vag,vae,vac,uva,utu,uts,ute,uta,ziz,use,zit,urp,urn,ure,urd,urb,zip,ups,upo,zin,uns,uni,zig,umu,ums,ump,umm,zho,ulu,ule,uke,zex,ugs,ugh,zep,ufo,uey,uds,udo,tyg,tye,twp,two,twa,tux,tut,tup,tun,tum,tui,tug,tub,tsk,try,toy,aby,tow,tot,tor,top,too,ton,tom,tog,toe,tod,toc,zel,tix,tit,tis,tip,tin,til,tik,tig,tie,tid,tic,zek,thy,tho,the,tex,tew,tet,tes,ten,tel,teg,tef,tee,ted,tec,tea,zee,tay,tax,taw,tav,tau,tat,tas,tar,tap,tao,tan,tam,tak,taj,tai,tag,tae,tad,tab,zed,syn,sye,swy,sus,sur,suq,sup,sun,sum,suk,sui,sug,sue,sud,sub,sty,zea,sri,spy,spa,soz,soy,sox,sow,sov,sou,sot,sos,sop,son,som,sol,soh,sog,sod,soc,sob,zax,sny,ace,sma,sly,sky,ski,ska,six,sit,sis,sir,sip,sin,sim,sik,sif,ach,sic,sib,zas,shy,shh,she,sha,zap,sez,sey,sex,sew,set,ser,sen,sel,sei,seg,see,sed,sec,sea,saz,say,sax,saw,sav,sau,sat,sar,sap,san,sam,sal,sai,sag,sae,sad,sac,sab,rye,rya,rut,run,rum,rug,rue,rud,ruc,rub,row,rot,roo,rom,rok,roe,rod,roc,rob,riz,rit,rip,rin,rim,rig,rif,rid,rib,ria,rhy,rho,rez,rex,rew,rev,ret,res,rep,reo,ren,rem,rei,reh,reg,ref,ree,act,red,rec,reb,zag,ray,rax,raw,rav,rat,ras,rap,ran,ram,raj,rai,rah,rag,rad,qua,qis,qin,zuz,qat,pyx,pye,pya,puy,put,pus,pur,pup,pun,pul,puh,pug,pud,pub,pst,psi,pry,yus,pro,pre,poz,pox,pow,pot,pos,add,pop,poo,pom,pol,poi,poh,pod,poa,yup,ply,plu,pix,piu,pit,pis,pir,pip,pin,pig,pie,pic,pia,yum,pht,pho,phi,pew,pet,pes,per,pep,pen,pel,peh,peg,pee,ped,pec,pea,yuk,pay,pax,paw,pav,pat,pas,par,pap,pan,pam,pal,pah,pad,pac,abb,oys,oye,yug,oxy,oxo,zos,owt,own,owl,owe,yow,ova,out,ous,our,oup,ouk,oud,you,ose,yon,ort,ors,orf,ore,ord,orc,orb,ora,yom,opt,ops,ope,yok,oot,oos,oor,oop,oon,oom,ooh,oof,yod,ony,ons,ono,one,yob,oms,aas,ado,olm,ole,old,oke,oka,ois,oil,oik,yip,ohs,oho,ohm,yin,oft,off,yid,oes,ygo,ods,ode,odd,oda,yex,och,oca,obs,obo,obi,obe,oba,yew,oat,oar,oak,oaf,nys,nye,yet,nut,nus,ads,nur,nun,nub,yes,nth,noy,nox,now,not,nos,nor,noo,non,nom,noh,nog,nod,nob,yep,nix,nit,nis,nip,nim,nil,nie,nid,nib,new,net,nep,nek,neg,zzz,nee,ned,neb,yen,nay,naw,nat,nas,nap,nan,nam,nah,nag,nae,nab,yeh,myc,yea,mux,mut,mus,mun,mum,mug,mud,zoo,moz,moy,mow,mou,mot,adz,mos,yay,mor,mop,moo,mon,mom,mol,moi,mog,moe,mod,moc,mob,moa,yaw,mna,yar,miz,mix,mis,mir,mim,mil,mig,mid,mic,mib,yap,mho,mew,meu,met,mes,men,mem,mel,meh,meg,mee,med,yam,may,max,maw,mat,mas,mar,map,man,mam,mal,mak,aah,mag,mae,mad,mac,maa,yak,lym,lye,luz,lux,luv,lur,lum,lug,lud,loy,lox,aff,low,lou,lot,los,lor,lop,loo,log,lod,lob,yah,lit,lis,lip,lin,lig,lie,lid,lib,yag,lez,ley,lex,lew,lev,leu,let,les,lep,lek,lei,leg,lee,led,lea,lay,lax,law,lav,lat,las,lar,lap,lam,lah,lag,lad,aft,lac,lab,yae,kyu,kye,yad,kue,kow,kos,kor,kop,kon,koi,kob,koa,amp,aba,aga,kit,kis,kir,kip,kin,kif,kid,xis,khi,key,kex,ket,age,kep,ken,keg,kef,ked,keb,kea,kay,kaw,kat,kas,kam,kak,kai,kaf,kae,kab,zol,jut,jus,jun,jug,jud,joy,jow,jot,jor,jol,jog,joe,job,wyn,jiz,jin,jig,jib,jew,jeu,jet,jee,jay,jaw,jar,jap,jam,jak,jai,jag,jab,wye,iwi,ivy,its,ita,wus,iso,ism,ish,wud,irk,ire,ios,ion,wry,ins,ago,inn,ink,ing,wox,imp,ill,ilk,igg,ifs,iff,wow,ids,ide,wot,icy,ick,ich,ice,hyp,hye,hut,hup,hun,hum,hui,huh,hug,hue,hub,hoy,hox,how,hot,hos,hop,hoo,hon,hom,ags,hoi,hoh,hog,hoe,hod,hoc,hob,hoa,wos,hmm,wop,woo,aha,hit,ahi,his,hip,ahs,hin,him,won,aia,aid,hie,hid,hic,wok,hey,hex,hew,het,hes,her,ail,hep,hen,hem,heh,aim,wog,hay,haw,ain,air,hat,has,hap,hao,han,ham,haj,hah,hag,hae,had,wof,gyp,gym,guy,guv,gut,gus,gur,gup,gun,gum,gul,gue,gub,woe,goy,gox,gov,got,gos,gor,goo,gon,ais,ait,goe,god,gob,goa,zoa,aka,gnu,ake,gju,git,gis,wiz,ala,gip,gio,gin,gig,gif,gie,gid,gib,wit,ghi,gey,get,ger,geo,gen,gem,gel,gee,ged,gay,alb,gaw,gau,gat,gas,gar,gap,gan,gam,gal,gak,gag,gae,gad,gab,wis,fur,fun,fum,fug,fud,fub,fry,fro,fra,foy,fox,fou,for,fop,fon,foh,fog,foe,fob,fly,flu,fiz,fix,fit,ale,fir,fin,fil,fig,fie,fid,fib,fez,fey,few,feu,fet,fes,fer,fen,fem,feh,feg,fee,fed,alf,win,fay,fax,faw,fat,fas,far,fap,fan,fah,fag,fae,fad,fab,faa,wig,eye,exo,why,ewt,ewk,ewe,evo,eve,euk,eth,eta,who,est,ess,abo,ers,err,ern,erm,erk,erg,erf,ere,era,wha,eon,ens,eng,ene,end,wey,emu,ems,emo,emf,eme,wex,elt,els,elm,ell,elk,elf,eld,wet,eke,eik,ehs,wen,ego,egg,eft,efs,eff,wem,een,eel,eek,wee,eds,edh,wed,ecu,eco,ech,ebb,eau,eat,eas,ear,ean,web,dzo,dye,all,dux,dup,duo,dun,dui,duh,dug,due,dud,dub,dso,dry,doy,dow,dot,dos,dor,dop,doo,don,dom,dol,doh,dog,dof,doe,dod,doc,dob,aal,div,dit,dis,dip,din,dim,dig,dif,die,did,dib,way,dey,dex,dew,dev,den,del,dei,deg,def,dee,deb,wax,day,daw,das,dap,dan,dam,dal,dak,dah,dag,dae,dad,dab,waw,cwm,cuz,cut,cur,cup,cum,cue,cud,cub,cry,cru,coz,coy,cox,cow,cot,cos,cor,alp,cop,coo,con,col,cog,cod,cob,cly,als,alt,cit,cis,cig,cid,chi,che,cha,wat,cep,cel,cee,caz,cay,caw,cat,alu,car,cap,can,cam,cag,cad,cab,caa,bys,bye,was,buy,war,ama,but,bus,bur,bun,bum,bug,bud,bub,bru,brr,bro,bra,boy,box,bow,bot,bos,bor,bop,boo,bon,bok,boi,boh,bog,bod,bob,boa,wap,biz,bit,bis,bio,bin,big,bid,bib,wan,bez,bey,bet,bes,ame,ben,bel,beg,bee,bed,wai,bay,bat,bas,bar,bap,ban,bam,bal,bah,bag,bad,bac,ami,baa,wag,azo,ayu,ays,aye,wae,axe,wad,awn,awl,awk,awe,awa,wab,avo,ave,ava,auk,auf,aue,aua,att,ats,ate,vum,ass,asp,ask,ash,vug,ary,art,ars,arm,ark,arf,are,ard,arc,arb,vox,apt,app,apo,ape,any,ant,ans,ann,ani,ane,and,ana,vow,amu,nef,snot,snog,snod,snob,snit,snip,snig,snib,snee,sned,sneb,snaw,zarf,aced,snar,snap,snag,snab,smut,smur,smug,smog,smit,smir,smew,acer,smee,wont,wons,slut,slur,slum,slug,slue,slub,slow,slot,slop,slog,sloe,slob,slit,slip,slim,slid,sley,slew,slee,sled,sleb,slay,aces,slaw,slat,slap,slam,slag,slae,slab,skyr,skyf,wonk,skug,skua,skry,skol,skit,skis,skip,skio,skin,skim,skid,zaps,skew,sket,sker,skep,skeo,sken,skeg,skee,skaw,skat,skas,skag,womb,sjoe,sizy,size,wolf,sitz,sits,sith,site,wold,sist,siss,woks,sirs,siri,sire,woke,sips,sipe,zols,sins,sink,sinh,sing,sine,sind,wogs,sims,simp,simi,sima,zany,silt,silo,sill,silk,sile,sild,sike,sika,wofs,sijo,sign,sigh,sift,zags,sies,sien,sidh,woes,side,sida,sics,sick,sich,sice,zurf,sibs,sibb,wock,sial,woad,zack,shwa,shut,ache,shun,shul,shri,show,shot,shop,shoo,shog,shoe,shod,shmo,shiv,shit,shir,ship,shin,shim,zoic,shew,shet,shes,shed,shea,wive,shay,shaw,shat,shan,sham,shah,shag,shad,wits,with,wite,seys,ywis,sexy,sext,wist,sews,sewn,wiss,sett,sets,seta,wisp,sess,sesh,sese,sers,serr,serk,serf,sere,sera,wish,sept,seps,sent,sens,sene,send,sena,wise,semi,seme,sels,sell,self,achy,sele,seld,yuzu,sekt,seis,seir,seil,seik,seif,wiry,acid,segs,sego,wire,sees,seer,seep,seen,seem,seel,seek,seed,wipe,winy,sect,secs,seco,sech,able,seat,seas,sear,sean,seam,seal,wins,scye,scut,scur,scup,scum,scul,scug,scud,scry,scow,scot,scop,scog,scaw,scat,scar,scan,scam,scag,scad,scab,wino,says,winn,saxe,wink,saws,sawn,wing,savs,save,wine,saut,saul,wind,sati,sate,yutz,sass,sash,sars,sark,sari,sard,wimp,saps,wily,sant,sans,sank,sang,sane,sand,wilt,sams,samp,same,sama,will,salt,sals,salp,sall,sale,wili,saki,sake,sais,sair,sain,saim,sail,said,saic,wile,sagy,sags,sago,sage,acme,saga,wild,saft,safe,acne,wiki,sads,sado,sadi,sade,wigs,sacs,sack,zoea,sabs,sabe,wife,saag,rype,ryot,rynd,ryke,ryfe,ryes,wiel,ryas,ryal,wide,ruts,ruth,wick,rust,rusk,rush,ruse,rusa,ruru,rurp,runt,runs,rung,rune,rund,wich,rums,rump,rume,wice,ruly,rule,rukh,ruin,rugs,ruga,whys,ruff,rues,ruer,rued,yurt,ruds,rude,rudd,ably,rucs,ruck,whup,ruby,rubs,rube,whow,rowt,rows,whot,rove,roux,rout,roup,roum,roul,roue,rots,roto,rotl,roti,rote,rota,whop,rosy,rost,rose,rory,rort,rore,ropy,rope,root,roos,roop,roon,room,rook,roof,rood,whom,ronz,ront,rong,rone,roms,romp,roma,whoa,roll,rolf,role,roky,roks,roke,yups,roji,roin,roil,roes,roed,whiz,acre,rods,rode,whit,rocs,rock,roch,whir,robs,robe,whip,roar,roan,roam,road,riza,whio,rivo,rive,riva,ritz,ritt,rits,rite,whin,risp,risk,rise,ript,rips,ripp,ripe,whim,riot,rins,rink,ring,rine,rind,whig,rimy,rimu,rims,rime,rima,whid,rill,rile,rigs,rigg,whey,rift,rifs,riff,rife,whew,riem,riel,rids,ride,whet,ricy,rick,rich,rice,ribs,riba,when,rias,rial,riad,zobu,whee,rhus,rhos,what,rhea,whap,wham,rews,whae,revs,yunx,rets,rete,weys,rest,resh,yump,reps,repp,repo,wexe,reos,zobo,reny,rent,rens,renk,rend,wets,rems,weta,rely,reke,reis,rein,reik,reif,yule,rehs,west,regs,rego,wert,reft,refs,wero,rees,reen,reel,reek,reef,reed,were,reds,redo,wept,acta,rede,redd,went,recs,reck,wens,rebs,wend,rear,reap,rean,ream,real,reak,read,wena,razz,raze,rays,raya,yuky,wems,raws,rawn,wemb,ravs,rave,yuks,raun,ratu,rats,rato,rath,rate,rata,welt,rast,rasp,rash,rase,wels,rark,rare,rapt,raps,rape,well,rant,rank,rani,rang,rand,rana,welk,rams,ramp,rami,weld,rale,raku,raki,rake,raja,weka,rait,rais,rain,rail,raik,raid,raia,weir,rahs,weil,ragu,rags,ragi,ragg,rage,raga,weid,raft,raff,rads,rade,weft,racy,rack,rach,race,raca,rabi,quop,quod,quiz,quit,quip,quin,quim,quid,quey,quep,quay,quat,quai,quag,quad,weet,qoph,wees,qins,weer,weep,qats,ween,acts,qaid,qadi,weem,pyro,pyre,pyot,pyne,pyin,pyic,pyet,pyes,weel,pyat,pyas,week,puys,weed,putz,putt,puts,yuko,puss,push,weds,purs,purr,purl,puri,pure,yuke,pupu,pups,pupa,webs,puny,punt,puns,punk,pung,puna,zupa,pumy,pump,puma,puly,pulu,puls,pulp,pull,pulk,puli,pule,pula,wear,puky,puku,puke,puka,puja,puir,puha,wean,pugs,pugh,weal,puff,puer,pudu,puds,weak,puck,puce,pubs,pube,yugs,acyl,ptui,ways,psst,psis,yuga,prys,waxy,pruh,prow,zulu,pros,prop,proo,prom,prog,prof,prod,prob,proa,waws,prim,prig,prez,prey,prex,prep,prem,pree,wawl,pray,prau,prat,prao,pram,prad,pozz,wawe,poxy,wawa,pows,pown,abba,pout,pour,pouk,pouf,pott,pots,pote,wavy,posy,post,poss,posh,pose,wave,pory,port,adaw,porn,pork,pore,pops,pope,waur,waul,poot,poos,poor,poop,poon,pool,pook,pooh,poof,pood,wauk,pony,pont,pons,ponk,pong,pone,pond,poms,pomp,pomo,pome,watt,poly,polt,pols,polo,poll,polk,pole,wats,poky,poke,pois,wate,zizz,pogy,pogo,poet,poep,poem,pods,wast,poco,pock,poas,wasp,wash,core,moon');
    gameLogic.wordList = ("AAHS,  ABBA, ABBE, ABED, ABET, ABLE, ABLY, ABOS, ABRI, ABUT, ABYE, ABYS, ACAI, ACED, ACES, ACHE, ACHY, ACID, ACME, ACNE, ACRE, ACRO, ACTA, ACTS, ACYL, ADDS, ADIT, ADOS, ADZE, AEON, AERO, AERY, AFAR, AFRO, AGAR, AGAS, AGED, AGEE, AGER, AGES, AGHA, AGIN, AGIO, AGLU, AGLY, AGMA, AGOG, AGON, AGRO, AGUE, AHED, AHEM, AHIS, AHOY, AIDE, AIDS, AILS, AIMS, AINS, AIRN, AIRS, AIRT, AIRY, AITS, AJAR, AJEE, AJIS, AKEE, AKIN, ALAE, ALAN, ALAR, ALAS, ALBA, ALBS, ALEC, ALEE, ALEF, ALES, ALFA, ALGA, ALIF, ALIT, ALKY, ALLS, ALLY, ALMA, ALME, ALMS, ALOE, ALOW, ALPS, ALSO, ALTO, ALTS, ALUM, AMAH, AMAS, AMBO, AMEN, AMIA, AMID, AMIE, AMIN, AMIR, AMIS, AMMO, AMOK, AMPS, AMUS, AMYL, ANAL, ANAS, ANDS, ANES, ANEW, ANGA, ANIL, ANIS, ANKH, ANNA, ANOA, ANON, ANSA, ANTA, ANTE, ANTI, ANTS, ANUS, APED, APER, APES, APEX, APOD, APOS, APPS, APSE, AQUA, ARAK, ARBS, ARCH, ARCO, ARCS, AREA, AREG, ARES, ARFS, ARGH, ARIA, ARID, ARIL, ARKS, ARMS, ARMY, ARSE, ARTS, ARTY, ARUM, ARVO, ARYL, ASCI, ASEA, ASHY, ASKS, ASPS, ATAP, ATES, ATMA, ATOM, ATOP, AUGH, AUKS, AULD, AUNT, AURA, AUTO, AVER, AVES, AVID, AVOS, AVOW, AWAY, AWED, AWEE, AWES, AWLS, AWNS, AWNY, AWOL, AWRY, AXAL, AXED, AXEL, AXES, AXIL, AXIS, AXLE, AXON, AYAH, AYES, AYIN, BAAS, BABA, BABE, BABU, BABY, BACH, BACK, BADE, BADS, BAFF, BAGS, BAHT, BAIL, BAIT, BAKE, BALD, BALE, BALK, BALL, BALM, BALS, BAMS, BANC, BAND, BANE, BANG, BANI, BANK, BANS, BAPS, BARB, BARD, BARE, BARF, BARK, BARM, BARN, BARS, BASE, BASH, BASK, BASS, BAST, BATE, BATH, BATS, BATT, BAUD, BAWD, BAWK, BAWL, BAWN, BAYS, BAZZ, BEAD, BEAK, BEAL, BEAM, BEAN, BEAR, BEAT, BEAU, BECK, BEDS, BEDU, BEEF, BEEN, BEEP, BEER, BEES, BEET, BEGS, BELL, BELS, BELT, BEMA, BEND, BENE, BENS, BENT, BERG, BERK, BERM, BEST, BETA, BETH, BETS, BEVY, BEYS, BHUT, BIAS, BIBB, BIBE, BIBS, BICE, BIDE, BIDI, BIDS, BIER, BIFF, BIGS, BIKE, BILE, BILK, BILL, BIMA, BIND, BINE, BING, BINS, BINT, BIOG, BIOS, BIRD, BIRK, BIRL, BIRO, BIRR, BISE, BISH, BISK, BITE, BITS, BITT, BIZE, BLAB, BLAE, BLAG, BLAH, BLAM, BLAT, BLAW, BLEB, BLED, BLET, BLEW, BLIN, BLIP, BLOB, BLOC, BLOG, BLOT, BLOW, BLUB, BLUE, BLUR, BOAR, BOAS, BOAT, BOBO, BOBS, BOCK, BODE, BODS, BODY, BOFF, BOGS, BOGY, BOHO, BOIL, BOLA, BOLD, BOLE, BOLL, BOLO, BOLT, BOMB, BOND, BONE, BONG, BONK, BONY, BOOB, BOOK, BOOM, BOON, BOOR, BOOS, BOOT, BOPS, BORA, BORE, BORK, BORN, BORT, BOSH, BOSK, BOSS, BOTA, BOTH, BOTS, BOTT, BOUT, BOWL, BOWS, BOXY, BOYO, BOYS, BOZO, BRAD, BRAE, BRAG, BRAN, BRAS, BRAT, BRAW, BRAY, BRED, BREE, BREN, BREW, BRIE, BRIG, BRIM, BRIN, BRIO, BRIS, BRIT, BROO, BROS, BROW, BRRR, BRUT, BRUX, BUBO, BUBS, BUBU, BUCK, BUDS, BUFF, BUGS, BUHL, BUHR, BULB, BULK, BULL, BUMF, BUMP, BUMS, BUNA, BUND, BUNG, BUNK, BUNN, BUNS, BUNT, BUOY, BURA, BURB, BURD, BURG, BURK, BURL, BURN, BURP, BURR, BURS, BURY, BUSH, BUSK, BUSS, BUST, BUSY, BUTE, BUTS, BUTT, BUYS, BUZZ, BYES, BYRE, BYRL, BYTE,CABS, CACA, CADE, CADI, CADS, CAFE, CAFF, CAFS, CAGE, CAGY, CAID, CAIN, CAKE, CAKY, CALF, CALK, CALL, CALM, CALO, CALS, CALX, CAME, CAMI, CAMO, CAMP, CAMS, CANE, CANS, CANT, CAPE, CAPH, CAPO, CAPS, CARB, CARD, CARE, CARK, CARL, CARN, CARP, CARR, CARS, CART, CASA, CASE, CASH, CASK, CAST, CATE, CATS, CAUL, CAVA, CAVE, CAVY, CAWS, CAYS, CAZH, CECA, CEDE, CEDI, CEES, CEIL, CELL, CELS, CELT, CENT, CEPE, CEPS, CERE, CERO, CERT, CESS, CETE, CHAD, CHAI, CHAM, CHAO, CHAP, CHAR, CHAT, CHAW, CHAY, CHEF, CHEM, CHEW, CHEZ, CHIA, CHIC, CHID, CHIN, CHIP, CHIS, CHIT, CHOC, CHON, CHOP, CHOW, CHUB, CHUG, CHUM, CIAO, CIGS, CINE, CINQ, CION, CIRE, CIST, CITE, CITY, CLAD, CLAG, CLAM, CLAN, CLAP, CLAW, CLAY, CLEF, CLEG, CLEW, CLIP, CLIT, CLOD, CLOG, CLON, CLOP, CLOT, CLOY, CLUB, CLUE, COAL, COAT, COAX, COBB, COBS, COCA, COCK, COCO, CODA, CODE, CODS, COED, COFF, COFT, COGS, COHO, COIF, COIL, COIN, COIR, COKE, COKY, COLA, COLD, COLE, COLS, COLT, COLY, COMA, COMB, COME, COMM, COMP, CONE, CONI, CONK, CONN, CONS, CONY, COOF, COOK, COOL, COON, COOP, COOS, COOT, COPE, COPS, COPY, CORD, CORE, CORF, CORK, CORM, CORN, CORS, CORY, COSH, COSS, COST, COSY, COTE, COTS, COUP, COVE, COWL, COWS, COWY, COXA, COYS, COZY, CRAB, CRAG, CRAM, CRAP, CRAW, CRED, CREW, CRIB, CRIP, CRIS, CRIT, CROC, CROP, CROW, CRUD, CRUS, CRUX, CUBE, CUBS, CUDS, CUED, CUES, CUFF, CUIF, CUKE, CULL, CULM, CULT, CUMS, CUNT, CUPS, CURB, CURD, CURE, CURF, CURL, CURN, CURR, CURS, CURT, CUSK, CUSP, CUSS, CUTE, CUTS, CWMS, CYAN, CYMA, CYME, CYST, CZAR,DABS, DACE, DADA, DADO, DADS, DAFF, DAFT, DAGO, DAGS, DAHL, DAHS, DAIS, DAKS, DALE, DALS, DAME, DAMN, DAMP, DAMS, DANG, DANK, DANS, DAPS, DARB, DARE, DARK, DARN, DART, DASH, DATA, DATE, DATO, DAUB, DAUT, DAVY, DAWK, DAWN, DAWS, DAWT, DAYS, DAZE, DEAD, DEAF, DEAL, DEAN, DEAR, DEBS, DEBT, DECK, DECO, DEED, DEEM, DEEP, DEER, DEES, DEET, DEFI, DEFT, DEFY, DEIL, DEKE, DELE, DELF, DELI, DELL, DELS, DELT, DEME, DEMO, DEMY, DENE, DENI, DENS, DENT, DENY, DEPS, DERE, DERM, DESI, DESK, DEVA, DEVI, DEVS, DEWS, DEWY, DEXY, DEYS, DHAK, DHAL, DHOW, DIAL, DIBS, DICE, DICK, DIDO, DIDY, DIED, DIEL, DIES, DIET, DIFF, DIFS, DIGS, DIKE, DILL, DIME, DIMS, DINE, DING, DINK, DINO, DINS, DINT, DIOL, DIPS, DIPT, DIRE, DIRK, DIRL, DIRT, DISC, DISH, DISK, DISS, DITA, DITE, DITS, DITZ, DIVA, DIVE, DJIN, DOAT, DOBE, DOBY, DOCK, DOCS, DODO, DOER, DOES, DOFF, DOGE, DOGS, DOGY, DOHS, DOIT, DOJO, DOLE, DOLL, DOLS, DOLT, DOME, DOMS, DONA, DONE, DONG, DONS, DOOB, DOOM, DOOR, DOPA, DOPE, DOPY, DORE, DORK, DORM, DORP, DORR, DORS, DORY, DOSA, DOSE, DOSH, DOSS, DOST, DOTE, DOTH, DOTS, DOTY, DOUM, DOUR, DOUT, DOUX, DOVE, DOWN, DOWS, DOXY, DOZE, DOZY, DRAB, DRAG, DRAM, DRAT, DRAW, DRAY, DREE, DREG, DREK, DREW, DRIB, DRIP, DROP, DRUB, DRUG, DRUM, DRYS, DUAD, DUAL, DUBS, DUCE, DUCI, DUCK, DUCT, DUDE, DUDS, DUEL, DUES, DUET, DUFF, DUGS, DUIT, DUKE, DULL, DULY, DUMA, DUMB, DUMP, DUNE, DUNG, DUNK, DUNS, DUNT, DUOS, DUPE, DUPS, DURA, DURE, DURN, DURO, DURR, DUSK, DUST, DUTY, DYAD, DYED, DYER, DYES, DYKE, EACH, EARL, EARN, EARS, EASE, EAST, EASY, EATH, EATS, EAUX, EAVE, EBBS, EBON, ECHE, ECHO, ECHT, ECOS, ECRU, ECUS, EDDO, EDDY, EDGE, EDGY, EDHS, EDIT, EEEW, EELS, EELY, EERY, EFFS, EFTS, EGAD, EGAL, EGER, EGGS, EGGY, EGIS, EGOS, EIDE, EKED, EKES, EKKA, ELAN, ELDS, ELHI, ELKS, ELLS, ELMS, ELMY, ELSE, EMES, EMEU, EMIC, EMIR, EMIT, EMMY, EMOS, EMUS, EMYD, ENDS, ENGS, ENOL, ENOW, ENUF, ENVY, EONS, EPEE, EPHA, EPIC, EPOS, ERAS, ERGO, ERGS, ERNE, ERNS, EROS, ERRS, ERST, ERUV, ESES, ESNE, ESPY, ESSE, ESTS, ETAS, ETCH, ETHS, ETIC, ETNA, ETUI, EURO, EVEN, EVER, EVES, EVIL, EWER, EWES, EXAM, EXEC, EXED, EXES, EXIT, EXON, EXPO, EYAS, EYED, EYEN, EYER, EYES, EYNE, EYRA, EYRE, FABS, FACE, FACT, FADE, FADO, FADS, FAFF, FAGS, FAHS, FAIL, FAIN, FAIR, FAKE, FALL, FALX, FAME, FANE, FANG, FANO, FANS, FARD, FARE, FARL, FARM, FARO, FART, FASH, FAST, FATE, FATS, FAUN, FAUX, FAVA, FAVE, FAWN, FAYS, FAZE, FEAL, FEAR, FEAT, FECK, FEDS, FEEB, FEED, FEEL, FEES, FEET, FEHS, FELL, FELT, FEME, FEMS, FEND, FENS, FEOD, FERE, FERN, FESS, FEST, FETA, FETE, FETS, FEUD, FEUS, FIAR, FIAT, FIBS, FICE, FICO, FIDO, FIDS, FIEF, FIFE, FIGS, FILA, FILE, FILK, FILL, FILM, FILO, FILS, FIND, FINE, FINK, FINO, FINS, FIRE, FIRM, FIRN, FIRS, FISC, FISH, FIST, FITS, FIVE, FIXT, FIZZ, FLAB, FLAG, FLAK, FLAM, FLAN, FLAP, FLAT, FLAW, FLAX, FLAY, FLEA, FLED, FLEE, FLEW, FLEX, FLEY, FLIC, FLIP, FLIR, FLIT, FLOC, FLOE, FLOG, FLOP, FLOW, FLUB, FLUE, FLUS, FLUX, FOAL, FOAM, FOBS, FOCI, FOES, FOGS, FOGY, FOHN, FOIL, FOIN, FOLD, FOLK, FOND, FONS, FONT, FOOD, FOOL, FOOS, FOOT, FOPS, FORA, FORB, FORD, FORE, FORK, FORM, FORT, FOSS, FOUL, FOUR, FOWL, FOXY, FOYS, FOZY, FRAE, FRAG, FRAP, FRAT, FRAY, FREE, FRET, FRIG, FRIT, FRIZ, FROE, FROG, FROM, FROW, FRUG, FUBS, FUCI, FUCK, FUDS, FUEL, FUGS, FUGU, FUJI, FULL, FUME, FUMY, FUND, FUNK, FUNS, FURL, FURS, FURY, FUSE, FUSS, FUTZ, FUZE, FUZZ, GABS, GABY, GACH, GADI, GADS, GAED, GAEN, GAES, GAFF, GAGA, GAGE, GAGS, GAIN, GAIT, GALA, GALE, GALL, GALS, GAMA, GAMB, GAME, GAMP, GAMS, GAMY, GANE, GANG, GAOL, GAPE, GAPS, GAPY, GARB, GARS, GASH, GASP, GAST, GATE, GATS, GAUD, GAUM, GAUN, GAUR, GAVE, GAWK, GAWP, GAYS, GAZE, GEAN, GEAR, GECK, GEDS, GEED, GEEK, GEES, GEEZ, GELD, GELS, GELT, GEMS, GENE, GENS, GENT, GENU, GERM, GEST, GETA, GETS, GEUM, GHAT, GHEE, GHIS, GIBE, GIBS, GIDS, GIED, GIEN, GIES, GIFS, GIFT, GIGA, GIGS, GILD, GILL, GILT, GIMP, GINK, GINS, GIPS, GIRD, GIRL, GIRN, GIRO, GIRT, GIST, GITE, GITS, GIVE, GLAD, GLAM, GLED, GLEE, GLEG, GLEN, GLEY, GLIA, GLIB, GLIM, GLOB, GLOM, GLOP, GLOW, GLUE, GLUG, GLUM, GLUT, GNAR, GNAT, GNAW, GNUS, GOAD, GOAL, GOAS, GOAT, GOBO, GOBS, GOBY, GODS, GOER, GOES, GOGO, GOJI, GOLD, GOLF, GONE, GONG, GOOD, GOOF, GOOK, GOON, GOOP, GOOS, GORE, GORM, GORP, GORY, GOSH, GOTH, GOUT, GOWD, GOWK, GOWN, GOYS, GRAB, GRAD, GRAM, GRAN, GRAT, GRAY, GREE, GREW, GREY, GRID, GRIG, GRIM, GRIN, GRIP, GRIT, GRIZ, GROG, GROK, GROT, GROW, GRUB, GRUE, GRUM, GUAN, GUAR, GUCK, GUDE, GUFF, GUID, GULF, GULL, GULP, GULS, GUMS, GUNK, GUNS, GURU, GUSH, GUST, GUTS, GUVS, GUYS, GYBE, GYMS, GYNO, GYPO, GYPS, GYRE, GYRI, GYRO,  HABU, HACK, HADE, HADJ, HAED, HAEM, HAEN, HAES, HAET, HAFT, HAGS, HAHA, HAHS, HAIK, HAIL, HAIR, HAJI, HAJJ, HAKE, HAKU, HALE, HALF, HALL, HALM, HALO, HALT, HAME, HAMS, HAND, HANG, HANK, HANT, HAPS, HARD, HARE, HARK, HARL, HARM, HARP, HART, HASH, HASP, HAST, HATE, HATH, HATS, HAUL, HAUT, HAVE, HAWK, HAWS, HAYS, HAZE, HAZY, HEAD, HEAL, HEAP, HEAR, HEAT, HEBE, HECK, HEED, HEEL, HEFT, HEHS, HEIL, HEIR, HELD, HELL, HELM, HELO, HELP, HEME, HEMP, HEMS, HENS, HENT, HEPS, HERB, HERD, HERE, HERL, HERM, HERN, HERO, HERS, HEST, HETH, HETS, HEWN, HEWS, HICK, HIDE, HIED, HIES, HIGH, HIKE, HILA, HILI, HILL, HILT, HIMS, HIND, HINS, HINT, HIPS, HIRE, HISN, HISS, HIST, HITS, HIVE, HIYA, HMMM, HOAR, HOAX, HOBO, HOBS, HOCK, HODS, HOED, HOER, HOES, HOGG, HOGS, HOKE, HOLD, HOLE, HOLK, HOLM, HOLO, HOLP, HOLS, HOLT, HOLY, HOMA, HOME, HOMO, HOMS, HOMY, HONE, HONG, HONK, HONS, HOOD, HOOF, HOOK, HOOP, HOOT, HOPE, HOPS, HORA, HORK, HORN, HOSE, HOST, HOTS, HOUR, HOVE, HOWE, HOWF, HOWK, HOWL, HOWS, HOYA, HOYS, HUBS, HUCK, HUED, HUES, HUFF, HUGE, HUGS, HUIC, HULA, HULK, HULL, HUMP, HUMS, \n HUNG,HUNH, HUNK, HUNS, HUNT, HURL, HURT, HUSH, HUSK, HUTS, HWAN, HWYL, HYLA, HYMN, HYPE, HYPO, HYPS, HYTE,  IBEX, IBIS, ICED, ICES, ICHS, ICKS, ICKY, ICON, IDEA, IDEM, IDES, IDLE, IDLY, IDOL, IDYL, IFFY, IGGS, IGLU, IKAT, IKON, ILEA, ILEX, ILIA, ILKA, ILKS, ILLS, ILLY, IMAM, IMID, IMMY, IMPI, IMPS, INBY, INCH, INFO, INIA, INKS, INKY, INLY, INNS, INRO, INTI, INTO, IONS, IOTA, IRED, IRES, IRID, IRIS, IRKS, IRON, ISBA, ISLE, ISMS, ITCH, ITEM,JABS, JACK, JADE, JAGG, JAGS, JAIL, JAKE, JAMB, JAMS, JANE, JAPE, JARL, JARS, JATO, JAUK, JAUP, JAVA, JAWS, JAYS, JAZZ, JEAN, JEED, JEEP, JEER, JEES, JEEZ, JEFE, JEHU, JELL, JEON, JERK, JESS, JEST, JETE, JETS, JEUX, JEWS, JIAO, JIBB, JIBE, JIBS, JIFF, JIGS, JILL, JILT, JIMP, JINK, JINN, JINS, JINX, JIRD, JISM, JIVE, JIVY, JIZZ, JOBS, JOCK, JOES, JOEY, JOGS, JOHN, JOIN, JOKE, JOKY, JOLE, JOLT, JOOK, JOSH, JOSS, JOTA, JOTS, JOUK, JOWL, JOWS, JOYS, JUBA, JUBE, JUCO, JUDO, JUDY, JUGA, JUGS, JUJU, JUKE, JUKU, JUMP, JUNK, JUPE, JURA, JURY, JUST, JUTE, JUTS,KAAS, KABS, KAIN, KAKA, KAKI, KALE, KAME, KAMI, KANA, KANE, KAON, KAPA, KAPH, KAPU, KARN, KART, KATA, KATS, KAVA, KAYO, KAYS, KBAR, KEAS, KECK, KEEF, KEEK, KEEL, KEEN, KEEP, KEET, KEFS, KEGS, KEIR, KELP, KELT, KEMP, KENO, KENS, KENT, KEPI,  KEPT, KERB, KERF, KERN, KETA, KETO, KEYS, KHAF, KHAN, KHAT, KHET, KHIS, KIBE, KICK, KIDS, KIEF, KIER, KIFS, KIKE, KILL, KILN, KILO, KILT, KINA, KIND, KINE, KING, KINK, KINO, KINS, KIPS, KIRK, KIRN, KIRS, KISS, KIST, KITE, KITH, KITS, KIVA, KIWI, KLIK, KNAP, KNAR, KNEE, KNEW, KNIT, KNOB, KNOP, KNOT, KNOW, KNUR, KOAN, KOAS, KOBO, KOBS, KOEL, KOHL, KOIS, KOJI, KOLA, KOLO, KONK, KOOK, KOPH, KOPS, KORA, KORE, KORS, KOSS, KOTO, KRAI, KRAY, KRIS, KUDO, KUDU, KUES, KUFI, KUNA, KUNE, KURU, KVAS, KYAK, KYAR, KYAT, KYES, LABS, LACE, LACK, LACS, LACY, LADE, LADS, LADY, LAGS, LAHS, LAIC, LAID, LAIN, LAIR, LAKE, LAKH, LAKY, LALL, LAMA, LAMB, LAME, LAMP, LAMS, LAND, LANE, LANG, LANK, LAPS, LARD, LARI, LARK, LARN, LARS, LASE, LASH, LASS, LAST, LATE, LATH, LATI, LATS, LATU, LAUD, LAVA, LAVE, LAVS, LAWN, LAWS, LAYS, LAZE, LAZY, LEAD, LEAF, LEAK, LEAL, LEAN, LEAP, LEAR, LEAS, LECH, LEDE, LEEK, LEER, LEES, LEET, LEFT, LEGS, LEHR, LEIS, LEKE, LEKS, LEKU, LEND, LENO, LENS, LENT, LEPT, LESS, LEST, LETS, LEUD, LEVA, LEVO, LEVS, LEVY, LEWD, LEYS, LIAR, LIAS, LIBS, LICE, LICH, LICK, LIDO, LIDS, LIED, LIEF, LIEN, LIER, LIES, LIEU, LIFE, LIFT, LIKE, LILO, LILT, LILY, LIMA, LIMB, LIME, LIMN, LIMO, LIMP, LIMY, LINE, LING, LINK, LINN, LINO, LINS, LINT, LINY, LION, LIPA, LIPE, LIPO, LIPS, LIRA, LIRE, LIRI, LISP, LIST, LITE, LITS, LITU, LIVE, LOAD, LOAF, LOAM, LOAN, LOBE, LOBO, LOBS, LOCA, LOCH, LOCI, LOCK, LOCO, LODE, LOFT, LOGE, LOGO, LOGS, LOGY, LOID, LOIN, LOLL, LONE, LONG, LOOF, LOOK, LOOM, LOON, LOOP, LOOS, LOOT, LOPE, LOPS, LORD, LORE, LORN, LORY, LOSE, LOSS, LOST, LOTA, LOTH, LOTI, LOTO, LOTS, LOUD, LOUP, LOUR, LOUT, LOVE, LOWE, LOWN, LOWS, LUAU, LUBE, LUCE, LUCK, LUDE, LUDO, LUDS, LUES, LUFF, LUGE, LUGS, LULL, LULU, LUMA, LUMP, LUMS, LUNA, LUNE, LUNG, LUNK, LUNS, LUNT, LUNY, LURE, LURK, LUSH, LUST, LUTE, LUTZ, LUVS, LUXE, LWEI, LYCH, LYES, LYNX, LYRE, MAAR, MABE, MACE, MACH, MACK, MACS, MADE, MADS, MAES, MAGE, MAGI, MAGS, MAID, MAIL, MAIM, MAIN, MAIR, MAKE, MAKI, MAKO, MALE, MALL, MALM, MALT, MAMA, MAMS, MANA, MANE, MANO, MANS, MANY, MAPS, MARA, MARC, MARE, MARK, MARL, MARS, MART, MASA, MASH, MASK, MASS, MAST, MATE, MATH, MATS, MATT, MAUD, MAUL, MAUN, MAUT, MAWN, MAWS, MAXI, MAYA, MAYO, MAYS, MAZE, MAZY, MEAD, MEAL, MEAN, MEAT, MECH, MEDS, MEED, MEEK, MEET, MEGA, MEGS, MELD, MELL, MELS, MELT, MEME, MEMO, MEMS, MEND, MENO, MENU, MEOU, MEOW, MERC, MERE, MERK, MERL, MESA, MESH, MESS, META, METE, METH, MEWL, MEWS, MEZE, MHOS, MIBS, MICA, MICE, MICK, MICS, MIDI, MIDS, MIEN, MIFF, MIGG, MIGS, MIKE, MILD, MILE, MILK, MILL, MILO, MILS, MILT, MIME, MINA, MIND, MINE, MINI, MINK, MINT, MINX, MIPS, MIRE, MIRI, MIRK, MIRS, MIRY, MISE, MISO, MISS, MIST, MITE, MITT, MITY, MIXT, MOAN, MOAS, MOAT, MOBS, MOCK, MOCS, MODE, MODI, MODS, MOFO, MOGS, MOHO, MOIL, MOJO, MOKE, MOLA, MOLD, MOLE, MOLL, MOLS, MOLT, MOLY, MOME, MOMI, MOMS, MONK, MONO, MONS, MONY, MOOD, MOOK, MOOL, MOON, MOOR, MOOS, MOOT, MOPE, MOPS, MOPY, MORA, MORE, MORN, MORS, MORT, MOSH, MOSK, MOSS, MOST, MOTE, MOTH, MOTS, MOTT, MOUE, MOVE, MOWN, MOWS, MOXA, MOZO, MUCH, MUCK, MUDS, MUFF, MUGG, MUGS, MULE, MULL, MUMM, MUMP, MUMS, MUMU, MUNG, MUNI, MUNS, MUON, MURA, MURE, MURK, MURR, MUSE, MUSH, MUSK, MUSO, MUSS, MUST, MUTE, MUTS, MUTT, MYCS, MYNA, MYTHNAAN, NABE, NABS, NADA, NAES, NAFF, NAGA, NAGS, NAIF, NAIL, NALA, NAME, NANA, NANO, NANS, NAOI, NAOS, NAPA, NAPE, NAPS, NARC, NARD, NARK, NARY, NAVE, NAVS, NAVY, NAYS, NAZI, NEAP, NEAR, NEAT, NEBS, NECK, NEED, NEEM, NEEP, NEGS, NEIF, NEMA, NENE, NEON, NERD, NESS, NEST, NETS, NETT, NEUK, NEUM, NEVE, NEVI, NEWB, NEWS, NEWT, NEXT, NIBS, NICE, NICK, NIDE, NIDI, NIFF, NIGH, NILL, NILS, NIMS, NINE, NIPA, NIPS, NISI, NITE, NITS, NIXE, NIXY, NOBS, NOCK, NODE, NODI, NODS, NOEL, NOES, NOGG, NOGS, NOIL, NOIR, NOLO, NOMA, NOME, NOMS, NONA, NONE, NOOK, NOON, NOPE, NORI, NORM, NOSE, NOSH, NOSY, NOTA, NOTE, NOUN, NOUS, NOVA, NOWS, NOWT, NUBS, NUDE, NUFF, NUGS, NUKE, NULL, NUMB, NUNS, NURD, NURL, NUTS, OAFS, OAKS, OAKY, OARS, OAST, OATH, OATS, OATY, OBAS, OBES, OBEY, OBIA, OBIS, OBIT, OBOE, OBOL, OCAS, OCHE, ODAH, ODAS, ODDS, ODEA, ODES, ODIC, ODOR, ODYL, OFAY, OFFA, OFFS, OGAM, OGEE, OGLE, OGRE, OHED, OHIA, OHMS, OIKS, OILS, OILY, OINK, OKAS, OKAY, OKEH, OKES, OKRA, OLDE, OLDS, OLDY, OLEA, OLEO, OLES, OLIO, OLLA, OMAS, OMEN, OMER, OMIT, ONCE, ONES, ONLY, ONOS, ONTO, ONUS, ONYX, OOHS, OOPS, OOTS, OOZE, OOZY, OPAH, OPAL, OPAS, OPED, OPEN, OPES, OPTS, OPUS, ORAD, ORAL, ORBS, ORBY, ORCA, ORCS, ORDO, ORES, ORGS, ORGY, ORLE, ORRA, ORTS, ORYX, ORZO, OSAR, OSES, OSSA, OTIC, OTTO, OUCH, OUDS, OUPH, OURS, OUST, OUTA, OUTS, OUZO, OVAL, OVEN, OVER, OVUM, OWED, OWES, OWLS, OWLY, OWNS, OWSE, OWTS, OXEN, OXER, OXES, OXIC, OXID, OXIM, OYER, OYES, OYEZ, PAAN, PACA, PACE, PACK, PACS, PACT, PACY, PADI, PADS, PAGE, PAID, PAIK, PAIL, PAIN, PAIR, PAKS, PALE, PALI, PALL, PALM, PALP, PALS, PALY, PAMS, PANE, PANG, PANS, PANT, PAPA, PAPS, PARA, PARD, PARE, PARK, PARR, PARS, PART, PASE, PASH, PASS, PAST, PATE, PATH, PATS, PATY, PAUA, PAVE, PAWL, PAWN, PAWS, PAYS, PEAG, PEAK, PEAL, PEAN, PEAR, PEAS, PEAT, PECH, PECK, PECS, PEDS, PEED, PEEK, PEEL, PEEN, PEEP, PEER, PEES, PEGS, PEHS, PEIN, PEKE, PELE, PELF, PELT, PEND, PENS, PENT, PEON, PEPO, PEPS, PERC, PERE, PERI, PERK, PERM, PERP, PERT, PERV, PESO, PEST, PETS, PEWS, PFFT, PFUI, PHAT, PHEW, PHIS, PHIZ, PHON, PHOS, PHOT, PHUT, PIAL, PIAN, PIAS, PICA, PICE, PICK, PICS, PIED, PIER, PIES, PIGS, PIKA, PIKE, PIKI, PILE, PILI, PILL, PILY, PIMA, PIMP, PINA, PINE, PING, PINK, PINS, PINT, PINY, PION, PIPA, PIPE, PIPS, PIPY, PIRN, PISH, PISO, PISS, PITA, PITH, PITS, PITY, PIXY, PLAN, PLAT, PLAY, PLEA, PLEB, PLED, PLEW, PLEX, PLIE, PLOD, PLOP, PLOT, PLOW, PLOY, PLUG, PLUM, PLUS, POCK, POCO, PODS, POEM, POET, POGO, POGY, POIS, POKE, POKY, POLE, POLL, POLO, POLS, POLY, POME, POMO, POMP, POMS, POND, PONE, PONG, PONS, PONY, POOD, POOF, POOH, POOL, POON, POOP, POOR, POOS, POPE, POPS, PORE, PORK, PORN, PORT, POSE, POSH, POST, POSY, POTS, POUF, POUR, POUT, POWS, POXY, PRAM, PRAO, PRAT, PRAU, PRAY, PREE, PREP, PREX, PREY, PREZ, PRIG, PRIM, PROA, PROB, PROD, PROF, PROG, PROM, PROP, PROS, PROW, PSIS, PSST, PTUI, PUBS, PUCE, PUCK, PUDS, PUDU, PUFF, PUGH, PUGS, PUJA, PUKE, PULA, PULE, PULI, PULK, PULL, PULP, PULS, PUMA, PUMP, PUNA, PUNG, PUNK, PUNS, PUNT, PUNY, PUPA, PUPS, PUPU, PURE, PURI, PURL, PURR, PURS, PUSH, PUSS, PUTS, PUTT, PUTZ, PYAS, PYES, PYIC, PYIN, PYRE, PYRO,QADI, QAID, QATS, QOPH, QUAD, QUAG, QUAI, QUAY, QUEY, QUID, QUIN, QUIP, QUIT, QUIZ, QUOD,RACE, RACK, RACY, RADS, RAFF, RAFT, RAGA, RAGE, RAGG, RAGI, RAGS, RAIA, RAID, RAIL, RAIN, RAIS, RAJA, RAKE, RAKI, RAKU, RALE, RAMI, RAMP, RAMS, RAND, RANG, RANI, RANK, RANT, RAPE, RAPS, RAPT, RARE, RASE, RASH, RASP, RATE, RATH, RATO, RATS, RAVE, RAWS, RAYA, RAYS, RAZE, RAZZ, READ, REAL, REAM, REAP, REAR, REBS, RECK, RECS, REDD, REDE, REDO, REDS, REED, REEF, REEK, REEL, REES, REFS, REFT, REGS, REIF, REIN, REIS, RELY, REMS, REND, RENO, RENT, REPO, REPP, REPS, RESH, REST, RETE, RETS, REVS, RHEA, RHOS, RHUS, RIAL, RIAS, RIBS, RICE, RICH, RICK, RIDE, RIDS, RIEL, RIFE, RIFF, RIFS, RIFT, RIGS, RILE, RILL, RIME, RIMS, RIMY, RIND, RING, RINK, RINS, RIOT, RIPE, RIPS, RISE, RISK, RITE, RITZ, RIVE, ROAD, ROAM, ROAN, ROAR, ROBE, ROBS, ROCK, ROCS, RODE, RODS, ROES, ROIL, ROLE, ROLF, ROLL, ROMP, ROMS, ROOD, ROOF, ROOK, ROOM, ROOS, ROOT, ROPE, ROPY, ROSE, ROSY, ROTA, ROTE, ROTI, ROTL, ROTO, ROTS, ROUE, ROUP, ROUT, ROUX, ROVE, ROWS, RUBE, RUBS, RUBY, RUCK, RUDD, RUDE, RUED, RUER, RUES, RUFF, RUGA, RUGS, RUIN, RUKH, RULE, RULY, RUMP, RUMS, RUNE, RUNG, RUNS, RUNT, RUSE, RUSH, RUSK, RUST, RUTH, RUTS, RYAS, RYES, RYKE, RYND, RYOT, RYUS,SABE, SABS, SACK, SACS, SADE, SADI, SAFE, SAGA, SAGE, SAGO, SAGS, SAGY, SAID, SAIL, SAIN, SAKE, SAKI, SALE, SALL, SALP, SALS, SALT, SAME, SAMP, SAND, SANE, SANG, SANK, SANS, SAPS, SARD, SARI, SARK, SASH, SASS, SATE, SATI, SAUL, SAVE, SAWN, SAWS, SAYS, SCAB, SCAD, SCAG, SCAM, SCAN, SCAR, SCAT, SCOP, SCOT, SCOW, SCRY, SCUD, SCUM, SCUP, SCUT, SEAL, SEAM, SEAR, SEAS, SEAT, SECS, SECT, SEED, SEEK, SEEL, SEEM, SEEN, SEEP, SEER, SEES, SEGO, SEGS, SEIF, SEIS, SELF, SELL, SELS, SEME, SEMI, SEND, SENE, SENT, SEPS, SEPT, SERA, SERE, SERF, SERS, SESH, SETA, SETS, SETT, SEVS, SEWN, SEWS, SEXT, SEXY, SHAD, SHAG, SHAH, SHAM, SHAT, SHAW, SHAY, SHEA, SHED, SHEN, SHES, SHEW, SHHH, SHIM, SHIN, SHIP, SHIT, SHIV, SHMO, SHOD, SHOE, SHOG, SHOO, SHOP, SHOT, SHOW, SHRI, SHUL, SHUN, SHUT, SHWA, SIAL, SIBB, SIBS, SICE, SICK, SICS, SIDE, SIDH, SIFT, SIGH, SIGN, SIGS, SIKA, SIKE, SILD, SILK, SILL, SILO, SILT, SIMA, SIMP, SIMS, SINE, SING, SINH, SINK, SINS, SIPE, SIPS, SIRE, SIRS, SITE, SITH, SITS, SIZE, SIZY, SKAG, SKAS, SKAT, SKED, SKEE, SKEG, SKEP, SKEW, SKID, SKIM, SKIN, SKIP, SKIS, SKIT, SKOL, SKRY, SKUA, SLAB, SLAG, SLAM, SLAP, SLAT, SLAW, SLAY, SLED, SLEW, SLID, SLIM, SLIP, SLIT, SLOB, SLOE, \n SLOG, SLOP, SLOT, SLOW, SLUB, SLUE, SLUG, SLUM, SLUR, SLUT, SMEW, SMIT, SMOG, SMUG, SMUT, SNAG, SNAP, SNAW, SNED, SNIB, SNIP, SNIT, SNOB, SNOG, SNOT, SNOW, SNUB, SNUG, SNYE, SOAK, SOAP, SOAR, SOBA, SOBS, SOCA, SOCK, SODA, SODS, SOFA, SOFT, SOHS, SOIL, SOJA, SOJU, SOKE, SOLA, SOLD, SOLE, SOLI, SOLO, SOLS, SOMA, SOME, SOMS, SONE, SONG, SONS, SOOK, SOON, SOOT, SOPH, SOPS, SORA, SORB, SORD, SORE, SORI, SORN, SORT, SOTH, SOTS, SOUK, SOUL, SOUP, SOUR, SOUS, SOWN, SOWS, SOYA, SOYS, SPAE, SPAM, SPAN, SPAR, SPAS, SPAT, SPAY, SPAZ, SPEC, SPED, SPEW, SPIC, SPIK, SPIN, SPIT, SPIV, SPOT, SPRY, SPUD, SPUE, SPUN, SPUR, SRIS, STAB, STAG, STAR, STAT, STAW, STAY, STEM, STEP, STET, STEW, STEY, STIR, STOA, STOB, STOP, STOT, STOW, STUB, STUD, STUM, STUN, STYE, SUBA, SUBS, SUCH, SUCK, SUDD, SUDS, SUED, SUER, SUES, SUET, SUGH, SUIT, SUKH, SUKS, SULK, SULU, SUMI, SUMO, SUMP, SUMS, SUMY, SUNG, SUNK, SUNN, SUNS, SUPE, SUPS, SUQS, SURA, SURD, SURE, SURF, SUSS, SWAB, SWAG, SWAM, SWAN, SWAP, SWAT, SWAY, SWIG, SWIM, SWOB, SWOP, SWOT, SWUM, SYBO, SYCE, SYKE, SYLI, SYNC, SYNE, SYPH, TABS, TABU, TACE, TACH, TACK, TACO, TACT, TADS, TAEL, TAGS, TAHR, TAIL, TAIN, TAKA, TAKE, TALA, TALC, TALE, TALI, TALK, TALL, TAME, TAMP, TAMS, TANG, TANK, TANS, TAOS, TAPA, TAPE, TAPS, TARE, TARN, TARO, TARP, TARS, TART, TASE, TASK, TASS, TATE, TATS, TAUS, TAUT, TAVS, TAWS, TAXA, TAXI, TEAK, TEAL, TEAM, TEAR, TEAS, TEAT, TECH, TECS, TEDS, TEED, TEEL, TEEM, TEEN, TEES, TEFF, TEGG, TEGS, TEGU, TEIN, TELA, TELE, TELL, TELS, TEMP, TEND, TENS, TENT, TEPA, TERM, TERN, TEST, TETH, TETS, TEWS, TEXT, THAE, THAN, THAT, THAW, THEE, THEM, THEN, THEW, THEY, THIN, THIO, THIR, THIS, THOU, THRO, THRU, THUD, THUG, THUS, TIAN, TICK, TICS, TIDE, TIDY, TIED, TIER, TIES, TIFF, TIKE, TIKI, TILE, TILL, TILS, TILT, TIME, TINE, TING, TINS, TINT, TINY, TIPI, TIPS, TIRE, TIRL, TIRO, TITI, TITS, TIVY, TIYN, TIZZ, TOAD, TOBY, TOCK, TOCO, TODS, TODY, TOEA, TOED, TOES, TOFF, TOFT, TOFU, TOGA, TOGS, TOIL, TOIT, TOKE, TOLA, TOLD, TOLE, TOLL, TOLT, TOLU, TOMB, TOME, TOMS, TONE, TONG, TONS, TONY, TOOK, TOOL, TOOM, TOON, TOOT, TOPE, TOPH, TOPI, TOPO, TOPS, TORA, TORC, TORE, TORI, TORN, TORO, TORR, TORS, TORT, TORY, TOSA, TOSH, TOSS, TOST, TOTE, TOTS, TOUR, TOUT, TOWN, TOWS, TOWY, TOYO, TOYS, TRAD, TRAM, TRAP, TRAY, TREE, TREF, TREK, TREM, TRES, TRET, TREY, TRIG, TRIM, TRIO, TRIP, TROD, TROG, TROP, TROT, TROU, TROW, TROY, TRUE, TRUG, TSAR, TSKS, TUBA, TUBE, TUBS, TUCK, TUFA, TUFF, TUFT, TUGS, TUIS, TULE, TUMP, TUMS, TUNA, TUNE, TUNG, TUNS, TUPS, TURD, TURF, TURK, TURN, TURR, TUSH, TUSK, TUTS, TUTU, TWAE, TWAS, TWAT, TWEE, TWIG, TWIN, TWIT, TWOS, TYEE, TYER, TYES, TYIN, TYKE, TYNE, TYPE, TYPO, TYPP, TYPY, TYRE, TYRO, TZAR, UDON, UDOS, UGHS, UGLY, UKES, ULAN, ULNA, ULUS, ULVA, UMBO, UMMA, UMPH, UMPS, UNAI, UNAU, UNBE, UNCI, UNCO, UNDE, UNDO, UNDY, UNIS, UNIT, UNTO, UPAS, UPBY, UPDO, UPON, URBS, URDS, UREA, URGE, URIC, URNS, URPS, URSA, URUS, USED, USER, USES, UTAS, UTES, UVEA,VACS, VAGI, VAIL, VAIN, VAIR, VALE, VAMP, VANE, VANG, VANS, VARA, VARS, VARY, VASA, VASE, VAST, VATS, VATU, VAUS, VAVS, VAWS, VEAL, VEEP, VEER, VEES, VEGA, VEIL, VEIN, VELA, VELD, VENA, VEND, VENT, VERA, VERB, VERT, VERY, VEST, VETO, VETS, VEXT, VIAL, VIBE, VICE, VIDE, VIDS, VIED, VIER, VIES, VIEW, VIFF, VIGA, VIGS, VILE, VILL, VIMS, VINA, VINE, VINO, VINS, VINY, VIOL, VIRL, VISA, VISE, VITA, VIVA, VIVE, VLEI, VLOG, VOES, VOGS, VOID, VOLE, VOLK, VOLT, VOTE, VOWS, VROW, VUGG, VUGH, VUGS, VULN,WAAH, WABS, WACK, WADE, WADI, WADS, WADY, WAES, WAFF, WAFT, WAGE, WAGS, WAIF, WAIL, WAIN, WAIR, WAIT, WAKE, WALE, WALI, WALK, WALL, WALY, WAME, WAND, WANE, WANK, WANS, WANT, WANY, WAPS, WARD, WARE, WARK, WARM, WARN, WARP, WARS, WART, WARY, WASH, WASP, WAST, WATS, WATT, WAUK, WAUL, WAUR, WAVE, WAVY, WAWL, WAWS, WAXY, WAYS, WEAK, WEAL, WEAN, WEAR, WEBS, WEDS, WEED, WEEK, WEEL, WEEN, WEEP, WEER, WEES, WEET, WEFT, WEIR, WEKA, WELD, WELL, WELT, WEND, WENS, WENT, WEPT, WERE, WERT, WEST, WETA, WETS, WHAM, WHAP, WHAT, WHEE, WHEN, WHET, WHEW, WHEY, WHID, WHIG, WHIM, WHIN, WHIP, WHIR, WHIT, WHIZ, WHOA, WHOM, WHOP, WHUP, WHYS, WICH, WICK, WIDE, WIFE, WIGS, WIKI, WILD, WILE, WILL, WILT, WILY, WIMP, WIND, WINE, WING, WINK, WINO, WINS, WINY, WIPE, WIRE, WIRY, WISE, WISH, WISP, WISS, WIST, WITE, WITH, WITS, WIVE, WOAD, WOES, WOGS, WOKE, WOKS, WOLD, WOLF, WOMB, WONK, WONS, WONT, WOOD, WOOF, WOOL, WOOS, WOPS, WORD, WORE, WORK, WORM, WORN, WORT, WOST, WOTS, WOVE, WOWS, WRAP, WREN, WRIT, WUSS, WYCH, WYES, WYLE, WYND, WYNN, WYNS, YACK, YAFF, YAGE, YAGI, YAGS, YAKS, YALD, YAMS, YANG, YANK, YAPS, YARD, YARE, YARN, YAUD, YAUP, YAWL, YAWN, YAWP, YAWS, YAYS, YEAH, YEAN, YEAR, YEAS, YECH, YEGG, YELD, YELK, YELL, YELP, YENS, YEOW, YEPS, YERK, YETI, YETT, YEUK, YEWS, YIDS, YILL, YINS, YIPE, YIPS, YIRD, YIRR, YLEM, YOBS, YOCK, YODH, YODS, YOGA, YOGH, YOGI, YOKE, YOKS, YOLK, YOMP, YOND, YONI, YOOF, YORE, YOUR, YOUS, YOWE, YOWL, YUAN, YUCA, YUCH, YUCK, YUGA, YUKS, YULE, YUPS, YURT, YUTZ, YUZU, ZAGS, ZANY, ZAPS, ZARF, ZEAL, ZEBU, ZEDA, ZEDS, ZEES, ZEIN, ZEKS, ZEPS, ZERK, ZERO, ZEST, ZETA, ZIGS, ZILL, ZINC, ZINE, ZING, ZINS, ZIPS, ZITI, ZITS, ZIZZ, ZOEA, ZOIC, ZONA, ZONE, ZONK, ZOOM, ZOON, ZOOS, ZORI, ZOUK, ZYME");
    gameLogic.myDictionary = gameLogic.wordList.trim().split(',').map(function (word) { return word.trim(); });
    //console.log(myDictionary[0]);
    function createEndMove(state, endMatchScores) {
        return {
            endMatchScores: endMatchScores,
            turnIndex: -1,
            state: state,
        };
    }
    gameLogic.createEndMove = createEndMove;
})(gameLogic || (gameLogic = {}));
/**
 * Returns true if the game ended in a tie because there are no empty cells.
 * E.g., isTie returns true for the following board:
 *     [['X', 'O', 'X'],
 *      ['X', 'O', 'O'],
 *      ['O', 'X', 'X']]
 
function isTie(board: Board): boolean {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (board[i][j] === '') {
        // If there is an empty cell then we do not have a tie.
        return false;
      }
    }
  }
  // No empty cells, so we have a tie!
  return true;
}
*/
/**
 * Return the winner (either 'X' or 'O') or '' if there is no winner.
 * The board is a matrix of size 3x3 containing either 'X', 'O', or ''.
 * E.g., getWinner returns 'X' for the following board:
 *     [['X', 'O', ''],
 *      ['X', 'O', ''],
 *      ['X', '', '']]
 */
//# sourceMappingURL=gameLogic.js.map