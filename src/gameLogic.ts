type Board = string[][];



interface BoardDelta {// extends Array<TextOf> {
  row: number;
  col: number;
}

type IProposalData = BoardDelta;
interface IState {
  board: Board;
  delta: BoardDelta;
  //guessList: TextOf;
}

interface IState {
  board: Board;
  delta: BoardDelta;
}

import gameService = gamingPlatform.gameService;
import alphaBetaService = gamingPlatform.alphaBetaService;
import translate = gamingPlatform.translate;
import resizeGameAreaService = gamingPlatform.resizeGameAreaService;
import log = gamingPlatform.log;
import dragAndDropService = gamingPlatform.dragAndDropService;

module gameLogic {
  export const ROWS = 4;
  export const COLS = 4;

  /** Returns the initial board, which is a 4x4 matrix containing letters.
   * 
   *    *  [['E', 'A', 'B', 'C'],
   *      ['D', 'A', 'B', 'C'],
   *      ['E', 'A', 'B', 'C']]
   */



  export function getInitialBoard(): Board {

    // window.alert("get initial board");
    let board: Board = [];


    let diceArr = [
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
    let curArr = [];
    for (let i = 0; i < ROWS; i++) {
      board[i] = [];
      for (let j = 0; j < COLS; j++) {
        let ran = Math.floor((Math.random() * 5));
        board[i][j] = diceArr[i][j][ran];
        //board[i][j] = diceArr[i][ran];
        log.info([ran, i, j, board[i][j][j]]);
        console.log(diceArr[i][ran]);


      }
    }
    return board;
  }
  export function getInitialState(): IState {
    return {
      board: getInitialBoard(), delta: null
    };
  }

  export function createInitialMove(): IMove {
    return {
      endMatchScores: null, turnIndex: 0,
      state: getInitialState()
    };
  }


  /**
   * Returns the move that should be performed when player
   * with index turnIndexBeforeMove makes a move in cell row X col.
   */
  export function createMove(
    stateBeforeMove: IState, row: number, col: number, turnIndexBeforeMove: number): IMove {
    if (!stateBeforeMove) {
      stateBeforeMove = getInitialState();
    }
    let board: Board = stateBeforeMove.board;
    console.log("this is createMove");
    // if (board[row][col] !== '') {
    //   throw new Error("One can only make a move in an empty position!");
    // }
    // if (getWinner(board) !== '' || isTie(board)) {
    //    throw new Error("Can only make a move if the game is not over!");
    // }
    let boardAfterMove = angular.copy(board);
    // boardAfterMove[row][col] = turnIndexBeforeMove === 0 ? 'X' : 'O';
    // let winner = getWinner(boardAfterMove);
    let endMatchScores: number[];
    let turnIndex: number;
    let delta: BoardDelta = { row: row, col: col };
    let state: IState = { delta: delta, board: boardAfterMove };
    return {
      endMatchScores: endMatchScores,
      turnIndex: turnIndex,
      state: state,

    };
  

    }
 export let wordList = ('a,vor,vol,voe,vly,vis,vin,vim,vig,vie,vid,via,vex,abs,vet,veg,vee,vaw,vav,vau,vat,vas,var,van,vag,vae,vac,uva,utu,uts,ute,uta,ziz,use,zit,urp,urn,ure,urd,urb,zip,ups,upo,zin,uns,uni,zig,umu,ums,ump,umm,zho,ulu,ule,uke,zex,ugs,ugh,zep,ufo,uey,uds,udo,tyg,tye,twp,two,twa,tux,tut,tup,tun,tum,tui,tug,tub,tsk,try,toy,aby,tow,tot,tor,top,too,ton,tom,tog,toe,tod,toc,zel,tix,tit,tis,tip,tin,til,tik,tig,tie,tid,tic,zek,thy,tho,the,tex,tew,tet,tes,ten,tel,teg,tef,tee,ted,tec,tea,zee,tay,tax,taw,tav,tau,tat,tas,tar,tap,tao,tan,tam,tak,taj,tai,tag,tae,tad,tab,zed,syn,sye,swy,sus,sur,suq,sup,sun,sum,suk,sui,sug,sue,sud,sub,sty,zea,sri,spy,spa,soz,soy,sox,sow,sov,sou,sot,sos,sop,son,som,sol,soh,sog,sod,soc,sob,zax,sny,ace,sma,sly,sky,ski,ska,six,sit,sis,sir,sip,sin,sim,sik,sif,ach,sic,sib,zas,shy,shh,she,sha,zap,sez,sey,sex,sew,set,ser,sen,sel,sei,seg,see,sed,sec,sea,saz,say,sax,saw,sav,sau,sat,sar,sap,san,sam,sal,sai,sag,sae,sad,sac,sab,rye,rya,rut,run,rum,rug,rue,rud,ruc,rub,row,rot,roo,rom,rok,roe,rod,roc,rob,riz,rit,rip,rin,rim,rig,rif,rid,rib,ria,rhy,rho,rez,rex,rew,rev,ret,res,rep,reo,ren,rem,rei,reh,reg,ref,ree,act,red,rec,reb,zag,ray,rax,raw,rav,rat,ras,rap,ran,ram,raj,rai,rah,rag,rad,qua,qis,qin,zuz,qat,pyx,pye,pya,puy,put,pus,pur,pup,pun,pul,puh,pug,pud,pub,pst,psi,pry,yus,pro,pre,poz,pox,pow,pot,pos,add,pop,poo,pom,pol,poi,poh,pod,poa,yup,ply,plu,pix,piu,pit,pis,pir,pip,pin,pig,pie,pic,pia,yum,pht,pho,phi,pew,pet,pes,per,pep,pen,pel,peh,peg,pee,ped,pec,pea,yuk,pay,pax,paw,pav,pat,pas,par,pap,pan,pam,pal,pah,pad,pac,abb,oys,oye,yug,oxy,oxo,zos,owt,own,owl,owe,yow,ova,out,ous,our,oup,ouk,oud,you,ose,yon,ort,ors,orf,ore,ord,orc,orb,ora,yom,opt,ops,ope,yok,oot,oos,oor,oop,oon,oom,ooh,oof,yod,ony,ons,ono,one,yob,oms,aas,ado,olm,ole,old,oke,oka,ois,oil,oik,yip,ohs,oho,ohm,yin,oft,off,yid,oes,ygo,ods,ode,odd,oda,yex,och,oca,obs,obo,obi,obe,oba,yew,oat,oar,oak,oaf,nys,nye,yet,nut,nus,ads,nur,nun,nub,yes,nth,noy,nox,now,not,nos,nor,noo,non,nom,noh,nog,nod,nob,yep,nix,nit,nis,nip,nim,nil,nie,nid,nib,new,net,nep,nek,neg,zzz,nee,ned,neb,yen,nay,naw,nat,nas,nap,nan,nam,nah,nag,nae,nab,yeh,myc,yea,mux,mut,mus,mun,mum,mug,mud,zoo,moz,moy,mow,mou,mot,adz,mos,yay,mor,mop,moo,mon,mom,mol,moi,mog,moe,mod,moc,mob,moa,yaw,mna,yar,miz,mix,mis,mir,mim,mil,mig,mid,mic,mib,yap,mho,mew,meu,met,mes,men,mem,mel,meh,meg,mee,med,yam,may,max,maw,mat,mas,mar,map,man,mam,mal,mak,aah,mag,mae,mad,mac,maa,yak,lym,lye,luz,lux,luv,lur,lum,lug,lud,loy,lox,aff,low,lou,lot,los,lor,lop,loo,log,lod,lob,yah,lit,lis,lip,lin,lig,lie,lid,lib,yag,lez,ley,lex,lew,lev,leu,let,les,lep,lek,lei,leg,lee,led,lea,lay,lax,law,lav,lat,las,lar,lap,lam,lah,lag,lad,aft,lac,lab,yae,kyu,kye,yad,kue,kow,kos,kor,kop,kon,koi,kob,koa,amp,aba,aga,kit,kis,kir,kip,kin,kif,kid,xis,khi,key,kex,ket,age,kep,ken,keg,kef,ked,keb,kea,kay,kaw,kat,kas,kam,kak,kai,kaf,kae,kab,zol,jut,jus,jun,jug,jud,joy,jow,jot,jor,jol,jog,joe,job,wyn,jiz,jin,jig,jib,jew,jeu,jet,jee,jay,jaw,jar,jap,jam,jak,jai,jag,jab,wye,iwi,ivy,its,ita,wus,iso,ism,ish,wud,irk,ire,ios,ion,wry,ins,ago,inn,ink,ing,wox,imp,ill,ilk,igg,ifs,iff,wow,ids,ide,wot,icy,ick,ich,ice,hyp,hye,hut,hup,hun,hum,hui,huh,hug,hue,hub,hoy,hox,how,hot,hos,hop,hoo,hon,hom,ags,hoi,hoh,hog,hoe,hod,hoc,hob,hoa,wos,hmm,wop,woo,aha,hit,ahi,his,hip,ahs,hin,him,won,aia,aid,hie,hid,hic,wok,hey,hex,hew,het,hes,her,ail,hep,hen,hem,heh,aim,wog,hay,haw,ain,air,hat,has,hap,hao,han,ham,haj,hah,hag,hae,had,wof,gyp,gym,guy,guv,gut,gus,gur,gup,gun,gum,gul,gue,gub,woe,goy,gox,gov,got,gos,gor,goo,gon,ais,ait,goe,god,gob,goa,zoa,aka,gnu,ake,gju,git,gis,wiz,ala,gip,gio,gin,gig,gif,gie,gid,gib,wit,ghi,gey,get,ger,geo,gen,gem,gel,gee,ged,gay,alb,gaw,gau,gat,gas,gar,gap,gan,gam,gal,gak,gag,gae,gad,gab,wis,fur,fun,fum,fug,fud,fub,fry,fro,fra,foy,fox,fou,for,fop,fon,foh,fog,foe,fob,fly,flu,fiz,fix,fit,ale,fir,fin,fil,fig,fie,fid,fib,fez,fey,few,feu,fet,fes,fer,fen,fem,feh,feg,fee,fed,alf,win,fay,fax,faw,fat,fas,far,fap,fan,fah,fag,fae,fad,fab,faa,wig,eye,exo,why,ewt,ewk,ewe,evo,eve,euk,eth,eta,who,est,ess,abo,ers,err,ern,erm,erk,erg,erf,ere,era,wha,eon,ens,eng,ene,end,wey,emu,ems,emo,emf,eme,wex,elt,els,elm,ell,elk,elf,eld,wet,eke,eik,ehs,wen,ego,egg,eft,efs,eff,wem,een,eel,eek,wee,eds,edh,wed,ecu,eco,ech,ebb,eau,eat,eas,ear,ean,web,dzo,dye,all,dux,dup,duo,dun,dui,duh,dug,due,dud,dub,dso,dry,doy,dow,dot,dos,dor,dop,doo,don,dom,dol,doh,dog,dof,doe,dod,doc,dob,aal,div,dit,dis,dip,din,dim,dig,dif,die,did,dib,way,dey,dex,dew,dev,den,del,dei,deg,def,dee,deb,wax,day,daw,das,dap,dan,dam,dal,dak,dah,dag,dae,dad,dab,waw,cwm,cuz,cut,cur,cup,cum,cue,cud,cub,cry,cru,coz,coy,cox,cow,cot,cos,cor,alp,cop,coo,con,col,cog,cod,cob,cly,als,alt,cit,cis,cig,cid,chi,che,cha,wat,cep,cel,cee,caz,cay,caw,cat,alu,car,cap,can,cam,cag,cad,cab,caa,bys,bye,was,buy,war,ama,but,bus,bur,bun,bum,bug,bud,bub,bru,brr,bro,bra,boy,box,bow,bot,bos,bor,bop,boo,bon,bok,boi,boh,bog,bod,bob,boa,wap,biz,bit,bis,bio,bin,big,bid,bib,wan,bez,bey,bet,bes,ame,ben,bel,beg,bee,bed,wai,bay,bat,bas,bar,bap,ban,bam,bal,bah,bag,bad,bac,ami,baa,wag,azo,ayu,ays,aye,wae,axe,wad,awn,awl,awk,awe,awa,wab,avo,ave,ava,auk,auf,aue,aua,att,ats,ate,vum,ass,asp,ask,ash,vug,ary,art,ars,arm,ark,arf,are,ard,arc,arb,vox,apt,app,apo,ape,any,ant,ans,ann,ani,ane,and,ana,vow,amu,nef,snot,snog,snod,snob,snit,snip,snig,snib,snee,sned,sneb,snaw,zarf,aced,snar,snap,snag,snab,smut,smur,smug,smog,smit,smir,smew,acer,smee,wont,wons,slut,slur,slum,slug,slue,slub,slow,slot,slop,slog,sloe,slob,slit,slip,slim,slid,sley,slew,slee,sled,sleb,slay,aces,slaw,slat,slap,slam,slag,slae,slab,skyr,skyf,wonk,skug,skua,skry,skol,skit,skis,skip,skio,skin,skim,skid,zaps,skew,sket,sker,skep,skeo,sken,skeg,skee,skaw,skat,skas,skag,womb,sjoe,sizy,size,wolf,sitz,sits,sith,site,wold,sist,siss,woks,sirs,siri,sire,woke,sips,sipe,zols,sins,sink,sinh,sing,sine,sind,wogs,sims,simp,simi,sima,zany,silt,silo,sill,silk,sile,sild,sike,sika,wofs,sijo,sign,sigh,sift,zags,sies,sien,sidh,woes,side,sida,sics,sick,sich,sice,zurf,sibs,sibb,wock,sial,woad,zack,shwa,shut,ache,shun,shul,shri,show,shot,shop,shoo,shog,shoe,shod,shmo,shiv,shit,shir,ship,shin,shim,zoic,shew,shet,shes,shed,shea,wive,shay,shaw,shat,shan,sham,shah,shag,shad,wits,with,wite,seys,ywis,sexy,sext,wist,sews,sewn,wiss,sett,sets,seta,wisp,sess,sesh,sese,sers,serr,serk,serf,sere,sera,wish,sept,seps,sent,sens,sene,send,sena,wise,semi,seme,sels,sell,self,achy,sele,seld,yuzu,sekt,seis,seir,seil,seik,seif,wiry,acid,segs,sego,wire,sees,seer,seep,seen,seem,seel,seek,seed,wipe,winy,sect,secs,seco,sech,able,seat,seas,sear,sean,seam,seal,wins,scye,scut,scur,scup,scum,scul,scug,scud,scry,scow,scot,scop,scog,scaw,scat,scar,scan,scam,scag,scad,scab,wino,says,winn,saxe,wink,saws,sawn,wing,savs,save,wine,saut,saul,wind,sati,sate,yutz,sass,sash,sars,sark,sari,sard,wimp,saps,wily,sant,sans,sank,sang,sane,sand,wilt,sams,samp,same,sama,will,salt,sals,salp,sall,sale,wili,saki,sake,sais,sair,sain,saim,sail,said,saic,wile,sagy,sags,sago,sage,acme,saga,wild,saft,safe,acne,wiki,sads,sado,sadi,sade,wigs,sacs,sack,zoea,sabs,sabe,wife,saag,rype,ryot,rynd,ryke,ryfe,ryes,wiel,ryas,ryal,wide,ruts,ruth,wick,rust,rusk,rush,ruse,rusa,ruru,rurp,runt,runs,rung,rune,rund,wich,rums,rump,rume,wice,ruly,rule,rukh,ruin,rugs,ruga,whys,ruff,rues,ruer,rued,yurt,ruds,rude,rudd,ably,rucs,ruck,whup,ruby,rubs,rube,whow,rowt,rows,whot,rove,roux,rout,roup,roum,roul,roue,rots,roto,rotl,roti,rote,rota,whop,rosy,rost,rose,rory,rort,rore,ropy,rope,root,roos,roop,roon,room,rook,roof,rood,whom,ronz,ront,rong,rone,roms,romp,roma,whoa,roll,rolf,role,roky,roks,roke,yups,roji,roin,roil,roes,roed,whiz,acre,rods,rode,whit,rocs,rock,roch,whir,robs,robe,whip,roar,roan,roam,road,riza,whio,rivo,rive,riva,ritz,ritt,rits,rite,whin,risp,risk,rise,ript,rips,ripp,ripe,whim,riot,rins,rink,ring,rine,rind,whig,rimy,rimu,rims,rime,rima,whid,rill,rile,rigs,rigg,whey,rift,rifs,riff,rife,whew,riem,riel,rids,ride,whet,ricy,rick,rich,rice,ribs,riba,when,rias,rial,riad,zobu,whee,rhus,rhos,what,rhea,whap,wham,rews,whae,revs,yunx,rets,rete,weys,rest,resh,yump,reps,repp,repo,wexe,reos,zobo,reny,rent,rens,renk,rend,wets,rems,weta,rely,reke,reis,rein,reik,reif,yule,rehs,west,regs,rego,wert,reft,refs,wero,rees,reen,reel,reek,reef,reed,were,reds,redo,wept,acta,rede,redd,went,recs,reck,wens,rebs,wend,rear,reap,rean,ream,real,reak,read,wena,razz,raze,rays,raya,yuky,wems,raws,rawn,wemb,ravs,rave,yuks,raun,ratu,rats,rato,rath,rate,rata,welt,rast,rasp,rash,rase,wels,rark,rare,rapt,raps,rape,well,rant,rank,rani,rang,rand,rana,welk,rams,ramp,rami,weld,rale,raku,raki,rake,raja,weka,rait,rais,rain,rail,raik,raid,raia,weir,rahs,weil,ragu,rags,ragi,ragg,rage,raga,weid,raft,raff,rads,rade,weft,racy,rack,rach,race,raca,rabi,quop,quod,quiz,quit,quip,quin,quim,quid,quey,quep,quay,quat,quai,quag,quad,weet,qoph,wees,qins,weer,weep,qats,ween,acts,qaid,qadi,weem,pyro,pyre,pyot,pyne,pyin,pyic,pyet,pyes,weel,pyat,pyas,week,puys,weed,putz,putt,puts,yuko,puss,push,weds,purs,purr,purl,puri,pure,yuke,pupu,pups,pupa,webs,puny,punt,puns,punk,pung,puna,zupa,pumy,pump,puma,puly,pulu,puls,pulp,pull,pulk,puli,pule,pula,wear,puky,puku,puke,puka,puja,puir,puha,wean,pugs,pugh,weal,puff,puer,pudu,puds,weak,puck,puce,pubs,pube,yugs,acyl,ptui,ways,psst,psis,yuga,prys,waxy,pruh,prow,zulu,pros,prop,proo,prom,prog,prof,prod,prob,proa,waws,prim,prig,prez,prey,prex,prep,prem,pree,wawl,pray,prau,prat,prao,pram,prad,pozz,wawe,poxy,wawa,pows,pown,abba,pout,pour,pouk,pouf,pott,pots,pote,wavy,posy,post,poss,posh,pose,wave,pory,port,adaw,porn,pork,pore,pops,pope,waur,waul,poot,poos,poor,poop,poon,pool,pook,pooh,poof,pood,wauk,pony,pont,pons,ponk,pong,pone,pond,poms,pomp,pomo,pome,watt,poly,polt,pols,polo,poll,polk,pole,wats,poky,poke,pois,wate,zizz,pogy,pogo,poet,poep,poem,pods,wast,poco,pock,poas,wasp,wash');
 export let myDictionary: string[] = 
wordList.trim().split(',');
console.log(myDictionary[0]);

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


}