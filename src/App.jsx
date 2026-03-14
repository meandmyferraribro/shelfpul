import { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from "react";
import { Package, Camera, TrendingUp, Bell, BarChart3, Search, Menu, X, Eye, EyeOff, ChevronRight, Star, Shield, ArrowRight, LogOut, Home, Upload, DollarSign, Settings, ShoppingCart, Layers, Trash2, RotateCcw, Check, Plus, RefreshCw, Globe, CameraOff, ZoomIn, CheckCircle, Info, ArrowUp, ArrowDown, Minus, AlertTriangle, Activity, Target, Clock, ExternalLink, ChevronDown, ChevronUp, Sun, Moon, Sparkles, Calculator, Loader, Copy, FileText, Users, UserPlus, ScanLine } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://sstrhiehmybhsxxkdnmv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzdHJoaWVobXliaHN4eGtkbm12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODAzMTYsImV4cCI6MjA4OTA1NjMxNn0.1HcBHgjy7_dEAYMiRjnO9_5ru1r0zlbbvV5OxdGmWxw");

// ═══ THEME CONTEXT ═══
const ThemeContext = createContext(null);
const useTheme = () => useContext(ThemeContext);
function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => { try { return window.__sp_dark || false; } catch { return false; } });
  const toggle = () => { setDark(d => { window.__sp_dark = !d; return !d; }); };
  useEffect(() => { document.documentElement.setAttribute("data-theme", dark ? "dark" : "light"); }, [dark]);
  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        setUser({ id: u.id, name: u.user_metadata?.name || u.email.split("@")[0], email: u.email, avatar: (u.user_metadata?.name || u.email)[0].toUpperCase() });
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({ id: u.id, name: u.user_metadata?.name || u.email.split("@")[0], email: u.email, avatar: (u.user_metadata?.name || u.email)[0].toUpperCase() });
      } else { setUser(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = (u) => setUser(u);
  const logout = async () => { await supabase.auth.signOut(); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}

const ProductsContext = createContext(null);
const useProducts = () => useContext(ProductsContext);
function ProductsProvider({ children }) {
  const [products, setProducts] = useState([
    { id:"p1", name:"Wireless Bluetooth Earbuds", category:"Electronics", price:"34.99", cost:"12.00", marketplace:"Amazon", status:"active", images:[], sku:"WBE-001", description:"Premium wireless earbuds with noise cancellation.", createdAt:"2026-03-10" },
    { id:"p2", name:'LED Ring Light 10"', category:"Photography", price:"22.50", cost:"8.50", marketplace:"Walmart", status:"active", images:[], sku:"LRL-010", description:"Professional LED ring light.", createdAt:"2026-03-09" },
    { id:"p3", name:"Phone Stand Adjustable", category:"Accessories", price:"15.99", cost:"4.25", marketplace:"Amazon", status:"price-alert", images:[], sku:"PSA-003", description:"Universal adjustable phone stand.", createdAt:"2026-03-08" },
    { id:"p4", name:"USB-C Hub 7-in-1", category:"Electronics", price:"29.00", cost:"11.00", marketplace:"Amazon", status:"active", images:[], sku:"UCH-007", description:"7-in-1 USB-C hub with HDMI.", createdAt:"2026-03-07" },
    { id:"p5", name:"Yoga Mat Premium", category:"Fitness", price:"19.99", cost:"6.00", marketplace:"Walmart", status:"new", images:[], sku:"YMP-001", description:"Extra thick non-slip yoga mat.", createdAt:"2026-03-06" },
  ]);
  const addProduct = (p) => { const np = { ...p, id:"p"+Date.now(), createdAt:new Date().toISOString().split("T")[0] }; setProducts(prev => [np,...prev]); return np; };
  return <ProductsContext.Provider value={{ products, addProduct }}>{children}</ProductsContext.Provider>;
}

const MP_SPECS = {
  amazon: { name:"Amazon", color:"#FF9900", bg:"#FFF8EC", min:1000, format:"JPEG, PNG, TIFF, GIF", bgReq:"Pure white (255,255,255)" },
  walmart: { name:"Walmart", color:"#0071DC", bg:"#EBF4FF", min:1000, format:"JPEG, PNG", bgReq:"White or light neutral" }
};

// ═══ PHASE 3: Competitor & Price Intelligence Data ═══
const COMPETITOR_DATA = {
  p1: { name:"Wireless Bluetooth Earbuds", yourPrice:34.99, cost:12.00, competitors:[
    {seller:"TechDeals Pro",price:36.99,mp:"Amazon",trend:"up",change:2.00,lastChecked:"2 hrs ago"},
    {seller:"SoundGear Direct",price:32.49,mp:"Amazon",trend:"down",change:-1.50,lastChecked:"1 hr ago"},
    {seller:"AudioMax Store",price:39.99,mp:"Walmart",trend:"stable",change:0,lastChecked:"3 hrs ago"},
    {seller:"ElectroBuys",price:33.99,mp:"Amazon",trend:"down",change:-1.00,lastChecked:"45 min ago"},
  ], history: Array.from({length:30},(_,i)=>({day:`Mar ${i+1}`,you:34.99+Math.sin(i/5)*2,low:30+Math.sin(i/3)*3,avg:35+Math.cos(i/4)*2,high:40+Math.sin(i/6)*3})), recommendation:"hold", recText:"Your price is competitive. The lowest competitor is $32.49 but has lower ratings. Hold your current price.", buyBox:true },
  p2: { name:'LED Ring Light 10"', yourPrice:22.50, cost:8.50, competitors:[
    {seller:"LightPro Studio",price:24.99,mp:"Walmart",trend:"up",change:1.00,lastChecked:"1 hr ago"},
    {seller:"PhotoGear Hub",price:19.99,mp:"Walmart",trend:"down",change:-2.00,lastChecked:"30 min ago"},
    {seller:"BrightLife Store",price:23.50,mp:"Amazon",trend:"stable",change:0,lastChecked:"2 hrs ago"},
  ], history: Array.from({length:30},(_,i)=>({day:`Mar ${i+1}`,you:22.50,low:18+Math.sin(i/4)*2,avg:22+Math.cos(i/5)*1.5,high:27+Math.sin(i/3)*2})), recommendation:"decrease", recText:"PhotoGear Hub undercuts you by $2.51 on Walmart. Consider dropping to $19.49 to win the listing.", buyBox:false },
  p3: { name:"Phone Stand Adjustable", yourPrice:15.99, cost:4.25, competitors:[
    {seller:"DeskGear Co",price:13.99,mp:"Amazon",trend:"down",change:-2.00,lastChecked:"12 min ago"},
    {seller:"StandMaster",price:14.49,mp:"Amazon",trend:"down",change:-0.50,lastChecked:"1 hr ago"},
    {seller:"PhoneProps Inc",price:16.99,mp:"Walmart",trend:"up",change:1.00,lastChecked:"2 hrs ago"},
    {seller:"TechStand Direct",price:12.99,mp:"Amazon",trend:"down",change:-1.00,lastChecked:"25 min ago"},
  ], history: Array.from({length:30},(_,i)=>({day:`Mar ${i+1}`,you:15.99,low:12+Math.sin(i/3)*2,avg:14.5+Math.cos(i/4)*1,high:18+Math.sin(i/5)*2})), recommendation:"decrease", recText:"Two competitors just dropped below $14. Lower to $13.49 to stay competitive or risk losing the Buy Box.", buyBox:false },
  p4: { name:"USB-C Hub 7-in-1", yourPrice:29.00, cost:11.00, competitors:[
    {seller:"HubTech Store",price:31.99,mp:"Amazon",trend:"up",change:2.00,lastChecked:"1 hr ago"},
    {seller:"ConnectPro",price:34.50,mp:"Amazon",trend:"up",change:3.50,lastChecked:"3 hrs ago"},
    {seller:"USBDirect",price:28.50,mp:"Walmart",trend:"stable",change:0,lastChecked:"2 hrs ago"},
  ], history: Array.from({length:30},(_,i)=>({day:`Mar ${i+1}`,you:29.00,low:26+Math.sin(i/4)*2,avg:30+Math.cos(i/3)*2,high:36+Math.sin(i/5)*3})), recommendation:"increase", recText:"Competitors are raising prices. You could increase to $31.99 and still be the lowest seller — adding $2.99 pure profit per unit.", buyBox:true },
  p5: { name:"Yoga Mat Premium", yourPrice:19.99, cost:6.00, competitors:[
    {seller:"FitLife Gear",price:21.99,mp:"Walmart",trend:"stable",change:0,lastChecked:"2 hrs ago"},
    {seller:"YogaPro Supply",price:18.49,mp:"Walmart",trend:"down",change:-1.50,lastChecked:"1 hr ago"},
    {seller:"ZenMat Co",price:24.99,mp:"Amazon",trend:"up",change:2.00,lastChecked:"4 hrs ago"},
  ], history: Array.from({length:30},(_,i)=>({day:`Mar ${i+1}`,you:19.99,low:17+Math.sin(i/3)*1.5,avg:20+Math.cos(i/4)*2,high:26+Math.sin(i/6)*2})), recommendation:"hold", recText:"You're well-positioned in the mid-range. One competitor is cheaper but has poor reviews. Hold your price.", buyBox:true },
};

const ANALYTICS_DATA = {
  revenue: Array.from({length:30},(_,i)=>({day:`Mar ${i+1}`,revenue:300+Math.sin(i/3)*150+Math.random()*100,orders:8+Math.floor(Math.sin(i/4)*4+Math.random()*3)})),
  byMarketplace: [{name:"Amazon",value:68,color:"#FF9900"},{name:"Walmart",value:32,color:"#0071DC"}],
  byCategory: [{name:"Electronics",value:45,color:"#2563eb"},{name:"Photography",value:18,color:"#7c3aed"},{name:"Accessories",value:15,color:"#f59e0b"},{name:"Fitness",value:12,color:"#10b981"},{name:"Other",value:10,color:"#6b7280"}],
  topProducts: [{name:"Wireless Earbuds",units:142,revenue:4969},{name:"USB-C Hub",units:98,revenue:2842},{name:"LED Ring Light",units:87,revenue:1958},{name:"Yoga Mat",units:76,revenue:1519},{name:"Phone Stand",units:64,revenue:1023}],
};

const GoogleIcon = () => (<svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>);

const CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
:root{--b:#0a0a0a;--w:#fff;--g50:#f8f9fa;--g100:#f1f3f5;--g200:#e9ecef;--g300:#dee2e6;--g400:#adb5bd;--g500:#868e96;--g600:#495057;--g700:#343a40;--g800:#212529;--g900:#121416;--p:#2563eb;--pd:#1d4ed8;--pl:#3b82f6;--pg:rgba(37,99,235,.15);--ok:#10b981;--err:#ef4444;--warn:#f59e0b;--am:#FF9900;--wm:#0071DC;--r:12px;--rs:8px;--rl:20px;--sh:0 1px 3px rgba(0,0,0,.06);--shm:0 4px 12px rgba(0,0,0,.08);--shl:0 12px 40px rgba(0,0,0,.12);--shx:0 20px 60px rgba(0,0,0,.15);--fd:'Outfit',sans-serif;--fb:'DM Sans',sans-serif;--t:all .3s cubic-bezier(.4,0,.2,1)}
[data-theme="dark"]{--b:#f0f0f0;--w:#1a1a2e;--g50:#16162a;--g100:#1e1e36;--g200:#2a2a44;--g300:#363654;--g400:#6b6b8a;--g500:#8888a4;--g600:#a8a8c0;--g700:#c8c8d8;--g800:#e0e0ec;--g900:#f0f0f8;--pg:rgba(37,99,235,.25);--sh:0 1px 3px rgba(0,0,0,.3);--shm:0 4px 12px rgba(0,0,0,.3);--shl:0 12px 40px rgba(0,0,0,.4);--shx:0 20px 60px rgba(0,0,0,.5)}
[data-theme="dark"] body{background:var(--g50)}
[data-theme="dark"] .nav.sc{background:rgba(26,26,46,.92)}
[data-theme="dark"] .sp-hero-mockup,.hm{border-color:var(--g200)}
[data-theme="dark"] .inp,.sel,.ta{background:var(--g100);border-color:var(--g200);color:var(--g800)}
[data-theme="dark"] .inp:focus,.sel:focus,.ta:focus{border-color:var(--p)}
[data-theme="dark"] .inp::placeholder{color:var(--g400)}
[data-theme="dark"] .srch{background:var(--g100);border-color:var(--g200)}
[data-theme="dark"] .srch:focus-within{background:var(--g100)}
[data-theme="dark"] .nb{border-color:var(--g200);background:var(--w)}
[data-theme="dark"] .cmd-box{background:var(--w);border-color:var(--g200)}
[data-theme="dark"] .cmd-kbd{background:var(--g200);border-color:var(--g300);color:var(--g600)}
[data-theme="dark"] .mpo{border-color:var(--g200)}
[data-theme="dark"] .toast{background:var(--w);border-color:var(--g200)}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:var(--fb);color:var(--g800);background:var(--w);-webkit-font-smoothing:antialiased;overflow-x:hidden}
@keyframes fu{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes cu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes cm{0%{transform:scale(0)}50%{transform:scale(1.2)}100%{transform:scale(1)}}@keyframes sp{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
.ai{animation:fu .6s ease forwards;opacity:0}.a1{animation-delay:.1s}.a2{animation-delay:.2s}.a3{animation-delay:.3s}.a4{animation-delay:.4s}
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;transition:var(--t)}.nav.sc{background:rgba(255,255,255,.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--g200);padding:12px 24px}.logo{font-family:var(--fd);font-weight:800;font-size:1.6rem;color:var(--b);letter-spacing:-.5px;cursor:pointer;display:flex;align-items:center;gap:8px}.logo .dot{width:10px;height:10px;background:var(--p);border-radius:50%}.nlinks{display:flex;align-items:center;gap:32px}.nlinks a{font-size:.9rem;font-weight:500;color:var(--g600);text-decoration:none;transition:var(--t)}.nlinks a:hover{color:var(--b)}
.btn{font-family:var(--fb);font-weight:600;font-size:.9rem;padding:12px 28px;border-radius:var(--r);border:none;cursor:pointer;transition:var(--t);display:inline-flex;align-items:center;gap:8px;text-decoration:none;white-space:nowrap}.bp{background:var(--p);color:var(--w)}.bp:hover{background:var(--pd);transform:translateY(-1px);box-shadow:var(--shm)}.bp:disabled{opacity:.6;cursor:not-allowed;transform:none}.bs{background:var(--w);color:var(--g800);border:1.5px solid var(--g300)}.bs:hover{border-color:var(--g400);background:var(--g50)}.bg{background:transparent;color:var(--g700);padding:10px 20px}.bg:hover{background:var(--g100)}.bl{padding:16px 36px;font-size:1rem;border-radius:14px}.bsm{padding:8px 16px;font-size:.8rem;border-radius:var(--rs)}.bgo{background:var(--w);color:var(--g700);border:1.5px solid var(--g200);width:100%;justify-content:center;padding:14px 24px}.bgo:hover{background:var(--g50)}
.hero{min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden;padding:120px 24px 80px}.hbg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(37,99,235,.08) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 80% 80%,rgba(245,158,11,.06) 0%,transparent 50%);pointer-events:none}.hgr{position:absolute;inset:0;background-image:linear-gradient(rgba(0,0,0,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.02) 1px,transparent 1px);background-size:60px 60px;pointer-events:none}.hin{max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;position:relative;z-index:1}
.hc h1{font-family:var(--fd);font-size:3.8rem;font-weight:800;line-height:1.08;letter-spacing:-1.5px;color:var(--b);margin-bottom:20px}.hc h1 .tg{background:linear-gradient(135deg,var(--p),#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.hc p{font-size:1.15rem;line-height:1.7;color:var(--g600);margin-bottom:36px;max-width:480px}.ha{display:flex;gap:16px;flex-wrap:wrap}.hs{display:flex;gap:40px;margin-top:48px;padding-top:32px;border-top:1px solid var(--g200)}.hsv{font-family:var(--fd);font-size:1.8rem;font-weight:700;color:var(--b)}.hsl{font-size:.8rem;color:var(--g500);margin-top:4px;letter-spacing:.5px;text-transform:uppercase}
.hv{position:relative;display:flex;justify-content:center;animation:fl 6s ease-in-out infinite}.hm{width:340px;background:var(--w);border-radius:24px;box-shadow:var(--shx);overflow:hidden;border:1px solid var(--g200)}.mh{background:var(--p);padding:16px 20px;display:flex;align-items:center;justify-content:space-between}.mh span{color:white;font-family:var(--fd);font-weight:600;font-size:.95rem}.mb{padding:20px}.mc{background:var(--g50);border-radius:var(--r);padding:16px;margin-bottom:12px;border:1px solid var(--g100)}.mcr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.mct{font-weight:600;font-size:.85rem;color:var(--g800)}.mcp{font-family:var(--fd);font-weight:700;font-size:.95rem}.mbar{height:6px;background:var(--g200);border-radius:3px;overflow:hidden}.mbf{height:100%;border-radius:3px}.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:.7rem;font-weight:600}
.sec{padding:100px 24px;max-width:1200px;margin:0 auto}.sh{text-align:center;margin-bottom:64px}.sl{font-family:var(--fd);font-size:.75rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--p);margin-bottom:12px}.st{font-family:var(--fd);font-size:2.6rem;font-weight:800;letter-spacing:-1px;color:var(--b);margin-bottom:16px}.sd{font-size:1.05rem;color:var(--g500);max-width:560px;margin:0 auto;line-height:1.7}.fg{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.fc{background:var(--w);border:1px solid var(--g200);border-radius:var(--rl);padding:36px 28px;transition:var(--t);position:relative;overflow:hidden}.fc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--p);transform:scaleX(0);transition:transform .4s ease;transform-origin:left}.fc:hover::before{transform:scaleX(1)}.fc:hover{border-color:var(--pg);box-shadow:var(--shl);transform:translateY(-4px)}.fi{width:48px;height:48px;border-radius:var(--r);display:flex;align-items:center;justify-content:center;margin-bottom:20px}.fc h3{font-family:var(--fd);font-size:1.15rem;font-weight:700;color:var(--b);margin-bottom:10px}.fc p{font-size:.9rem;color:var(--g500);line-height:1.65}
.cta{background:var(--g900);border-radius:var(--rl);padding:80px 48px;text-align:center;max-width:1200px;margin:0 auto 100px;position:relative;overflow:hidden}.cta::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(37,99,235,.2) 0%,transparent 60%);pointer-events:none}.cta h2{font-family:var(--fd);font-size:2.4rem;font-weight:800;color:var(--w);margin-bottom:16px;position:relative}.cta p{color:var(--g400);font-size:1.05rem;margin-bottom:36px;max-width:500px;margin-left:auto;margin-right:auto;position:relative}
.foot{padding:48px 24px;border-top:1px solid var(--g200);max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}.foot span{font-size:.85rem;color:var(--g500)}
.aw{min-height:100vh;display:flex}.al{flex:1;background:var(--g900);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px;position:relative;overflow:hidden}.al::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,rgba(37,99,235,.15) 0%,transparent 50%),radial-gradient(circle at 80% 70%,rgba(245,158,11,.1) 0%,transparent 50%);pointer-events:none}.alc{position:relative;z-index:1;max-width:400px}.al h2{font-family:var(--fd);font-size:2.2rem;font-weight:800;color:var(--w);margin-bottom:16px}.al p{color:var(--g400);line-height:1.7}.afs{margin-top:40px;display:flex;flex-direction:column;gap:16px}.afi{display:flex;align-items:center;gap:12px;color:var(--g300);font-size:.9rem}.afi svg{color:var(--pl);flex-shrink:0}.ar{flex:1;display:flex;align-items:center;justify-content:center;padding:40px;background:var(--w)}.afw{width:100%;max-width:400px}.afh{margin-bottom:32px}.afh h1{font-family:var(--fd);font-size:1.8rem;font-weight:700;color:var(--b);margin-bottom:8px}.afh p{color:var(--g500);font-size:.9rem}
.ig{margin-bottom:20px}.ig label{display:block;font-size:.85rem;font-weight:600;color:var(--g700);margin-bottom:6px}.iw{position:relative}.inp{width:100%;padding:13px 16px;border:1.5px solid var(--g200);border-radius:var(--r);font-family:var(--fb);font-size:.95rem;color:var(--g800);background:var(--w);transition:var(--t);outline:none}.inp:focus{border-color:var(--p);box-shadow:0 0 0 3px var(--pg)}.inp::placeholder{color:var(--g400)}.iic{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--g400);cursor:pointer}.sel{width:100%;padding:13px 16px;border:1.5px solid var(--g200);border-radius:var(--r);font-family:var(--fb);font-size:.95rem;color:var(--g800);background:var(--w);outline:none;appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23868e96' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;transition:var(--t)}.sel:focus{border-color:var(--p);box-shadow:0 0 0 3px var(--pg)}.ta{width:100%;padding:13px 16px;border:1.5px solid var(--g200);border-radius:var(--r);font-family:var(--fb);font-size:.95rem;color:var(--g800);background:var(--w);outline:none;resize:vertical;min-height:100px;transition:var(--t)}.ta:focus{border-color:var(--p);box-shadow:0 0 0 3px var(--pg)}.dv{display:flex;align-items:center;gap:16px;margin:24px 0;color:var(--g400);font-size:.8rem}.dv::before,.dv::after{content:'';flex:1;height:1px;background:var(--g200)}.asw{text-align:center;margin-top:28px;font-size:.9rem;color:var(--g500)}.asw a{color:var(--p);font-weight:600;cursor:pointer;text-decoration:none}.ferr{background:#fef2f2;border:1px solid #fecaca;color:var(--err);padding:10px 14px;border-radius:var(--rs);font-size:.85rem;margin-bottom:16px}
.db{display:flex;min-height:100vh;background:var(--g50)}.sb{width:260px;background:var(--w);border-right:1px solid var(--g200);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:100;transition:transform .3s ease}.sbh{padding:20px 24px;border-bottom:1px solid var(--g100);display:flex;align-items:center;justify-content:space-between}.sbn{flex:1;padding:16px 12px;overflow-y:auto}.sbl{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--g400);padding:12px 12px 6px}.sbk{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:var(--rs);color:var(--g600);font-size:.9rem;font-weight:500;cursor:pointer;transition:var(--t);border:none;background:none;width:100%;text-align:left;font-family:var(--fb)}.sbk:hover{background:var(--g50);color:var(--g800)}.sbk.act{background:var(--pg);color:var(--p);font-weight:600}.sbk svg{width:20px;height:20px;flex-shrink:0}.sbf{padding:16px;border-top:1px solid var(--g100)}
.mn{flex:1;margin-left:260px;min-height:100vh}.tb{background:var(--w);border-bottom:1px solid var(--g200);padding:16px 32px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}.tbl{display:flex;align-items:center;gap:16px}.tbt{font-family:var(--fd);font-size:1.3rem;font-weight:700;color:var(--b)}.tbr{display:flex;align-items:center;gap:16px}.srch{display:flex;align-items:center;gap:8px;background:var(--g50);border:1px solid var(--g200);border-radius:var(--r);padding:10px 16px;width:300px;transition:var(--t)}.srch:focus-within{border-color:var(--p);box-shadow:0 0 0 3px var(--pg);background:var(--w)}.srch input{border:none;outline:none;background:transparent;font-family:var(--fb);font-size:.9rem;color:var(--g800);width:100%}.srch input::placeholder{color:var(--g400)}.srch svg{color:var(--g400);flex-shrink:0;width:18px;height:18px}.av{width:36px;height:36px;border-radius:50%;background:var(--p);color:var(--w);display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:700;font-size:.85rem;cursor:pointer}.nb{width:40px;height:40px;border-radius:var(--rs);border:1px solid var(--g200);background:var(--w);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:var(--t);position:relative;color:var(--g600)}.nb:hover{background:var(--g50)}.nd{position:absolute;top:8px;right:8px;width:8px;height:8px;background:var(--err);border-radius:50%;border:2px solid var(--w)}.pc{padding:32px}
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:32px}.sc{background:var(--w);border:1px solid var(--g200);border-radius:var(--r);padding:24px;transition:var(--t)}.sc:hover{box-shadow:var(--shm)}.sch{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.scl{font-size:.8rem;font-weight:500;color:var(--g500);text-transform:uppercase;letter-spacing:.5px}.sci{width:36px;height:36px;border-radius:var(--rs);display:flex;align-items:center;justify-content:center}.scv{font-family:var(--fd);font-size:2rem;font-weight:700;color:var(--b);margin-bottom:4px}.scc{font-size:.8rem;font-weight:600;display:flex;align-items:center;gap:4px}
.dg{display:grid;grid-template-columns:2fr 1fr;gap:24px}.pn{background:var(--w);border:1px solid var(--g200);border-radius:var(--r);overflow:hidden}.pnh{padding:20px 24px;border-bottom:1px solid var(--g100);display:flex;align-items:center;justify-content:space-between}.pnt{font-family:var(--fd);font-weight:700;font-size:1rem;color:var(--b)}.pnb{padding:20px 24px}.li{display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid var(--g100)}.li:last-child{border-bottom:none}.lt{width:48px;height:48px;background:var(--g100);border-radius:var(--rs);display:flex;align-items:center;justify-content:center;color:var(--g400);flex-shrink:0;overflow:hidden}.lt img{width:100%;height:100%;object-fit:cover}.linf{flex:1;min-width:0}.ln{font-weight:600;font-size:.9rem;color:var(--g800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lm{font-size:.8rem;color:var(--g500);margin-top:2px}.lp{font-family:var(--fd);font-weight:700;color:var(--b);font-size:.95rem;white-space:nowrap}.ali{display:flex;align-items:flex-start;gap:12px;padding:14px 0;border-bottom:1px solid var(--g100)}.ali:last-child{border-bottom:none}.ald{width:8px;height:8px;border-radius:50%;margin-top:6px;flex-shrink:0}.alt{font-size:.85rem;color:var(--g700);line-height:1.5}.alti{font-size:.75rem;color:var(--g400);margin-top:4px}
.uz{border:2px dashed var(--g300);border-radius:var(--r);padding:48px 24px;text-align:center;cursor:pointer;transition:var(--t);background:var(--g50)}.uz:hover,.uz.dov{border-color:var(--p);background:var(--pg)}.uz.dov{border-style:solid}.uz input[type="file"]{display:none}
.pgr{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-top:16px}.pi{position:relative;aspect-ratio:1;border-radius:var(--r);overflow:hidden;background:var(--g100);border:2px solid transparent;transition:var(--t);cursor:pointer}.pi:hover{border-color:var(--p)}.pi.pri{border-color:var(--p)}.pi img{width:100%;height:100%;object-fit:cover}.po{position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;gap:8px;opacity:0;transition:var(--t)}.pi:hover .po{opacity:1}.po button{width:32px;height:32px;border-radius:50%;border:none;background:rgba(255,255,255,.9);color:var(--g800);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--t)}.po button:hover{background:var(--w);transform:scale(1.1)}.pb{position:absolute;top:8px;left:8px;background:var(--p);color:white;font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:12px}.pnum{position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.6);color:white;font-size:.7rem;font-weight:600;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.cm{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:2000;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:fi .3s ease}.cpv{width:100%;max-width:640px;aspect-ratio:4/3;background:var(--b);border-radius:var(--r);overflow:hidden;position:relative}.cpv video{width:100%;height:100%;object-fit:cover}.cpv canvas{display:none}.cc{display:flex;align-items:center;gap:24px;margin-top:24px}.csh{width:72px;height:72px;border-radius:50%;border:4px solid white;background:transparent;cursor:pointer;position:relative;transition:var(--t)}.csh::after{content:'';position:absolute;inset:4px;border-radius:50%;background:white;transition:var(--t)}.csh:hover::after{background:var(--g200)}.csh:active::after{transform:scale(.9)}.cb{width:48px;height:48px;border-radius:50%;border:none;background:rgba(255,255,255,.15);color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--t)}.cb:hover{background:rgba(255,255,255,.25)}
.lb{position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:2000;display:flex;align-items:center;justify-content:center;animation:fi .2s ease}.lb img{max-width:90%;max-height:85vh;border-radius:var(--r);object-fit:contain}.lbc{position:absolute;top:20px;right:20px;width:44px;height:44px;border-radius:50%;border:none;background:rgba(255,255,255,.15);color:white;cursor:pointer;display:flex;align-items:center;justify-content:center}
.stp{display:flex;align-items:center;gap:0;margin-bottom:32px}.stp-s{display:flex;align-items:center;gap:10px;flex:1}.stp-c{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:700;font-size:.85rem;flex-shrink:0;transition:var(--t)}.stp-c.a{background:var(--p);color:white}.stp-c.c{background:var(--ok);color:white}.stp-c.i{background:var(--g200);color:var(--g500)}.stp-l{font-size:.85rem;font-weight:600;color:var(--g700);white-space:nowrap}.stp-ln{flex:1;height:2px;background:var(--g200);margin:0 8px}.stp-ln.c{background:var(--ok)}
.ss{text-align:center;padding:60px 24px}.ssi{width:80px;height:80px;border-radius:50%;background:#ecfdf5;color:var(--ok);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;animation:cm .5s ease}.psp{width:48px;height:48px;border:3px solid var(--g200);border-top-color:var(--p);border-radius:50%;animation:sp .8s linear infinite;margin:0 auto 24px}
.mps{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}.mpo{padding:16px;border:2px solid var(--g200);border-radius:var(--r);cursor:pointer;transition:var(--t);text-align:center}.mpo:hover{border-color:var(--g400)}.mpo.sa{border-color:var(--am);background:#FFF8EC}.mpo.sw{border-color:var(--wm);background:#EBF4FF}.mpn{font-family:var(--fd);font-weight:700;font-size:1rem;margin-top:8px}
.mt{display:none;background:none;border:none;cursor:pointer;color:var(--g700)}.mo{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:999}
@media(max-width:1024px){.hin{grid-template-columns:1fr;gap:40px;text-align:center}.hc h1{font-size:2.8rem}.hc p{margin-left:auto;margin-right:auto}.ha{justify-content:center}.hs{justify-content:center}.hv{order:-1}.hm{width:280px}.fg{grid-template-columns:repeat(2,1fr)}.sg{grid-template-columns:repeat(2,1fr)}.dg{grid-template-columns:1fr}.stp{flex-wrap:wrap;gap:8px}}
@media(max-width:768px){.nlinks{display:none}.mt{display:block}.hero{padding:100px 20px 60px}.hc h1{font-size:2.2rem}.hs{flex-direction:column;gap:20px;align-items:center}.fg{grid-template-columns:1fr}.sec{padding:60px 20px}.st{font-size:1.8rem}.cta{padding:48px 24px;margin:0 16px 60px}.cta h2{font-size:1.6rem}.aw{flex-direction:column}.al{display:none}.ar{padding:24px}.sb{transform:translateX(-100%)}.sb.mop{transform:translateX(0)}.mo.act{display:block}.mn{margin-left:0}.tb{padding:14px 16px}.tbr .srch{display:none}.pc{padding:20px 16px}.sg{grid-template-columns:1fr}.pgr{grid-template-columns:repeat(auto-fill,minmax(100px,1fr))}.mps{grid-template-columns:1fr}.cpv{max-width:95vw}.pm-grid{grid-template-columns:1fr!important}.pm-comp-grid{grid-template-columns:1fr!important}.an-grid{grid-template-columns:1fr!important}}
.pm-grid{display:grid;grid-template-columns:320px 1fr;gap:24px;align-items:start}
.pm-list{display:flex;flex-direction:column;gap:8px}
.pm-item{padding:14px 16px;border-radius:var(--rs);border:1.5px solid var(--g200);cursor:pointer;transition:var(--t);background:var(--w)}.pm-item:hover{border-color:var(--g400)}.pm-item.sel{border-color:var(--p);background:var(--pg)}
.pm-item-name{font-weight:600;font-size:.9rem;color:var(--g800);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pm-item-meta{display:flex;align-items:center;gap:8px;font-size:.8rem}
.pm-rec{padding:16px;border-radius:var(--r);margin-bottom:20px;display:flex;align-items:flex-start;gap:12px}
.pm-rec-increase{background:#ecfdf5;border:1px solid #a7f3d0}.pm-rec-decrease{background:#fef2f2;border:1px solid #fecaca}.pm-rec-hold{background:#eff6ff;border:1px solid #bfdbfe}
.pm-comp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.pm-comp{padding:14px;border-radius:var(--rs);background:var(--g50);border:1px solid var(--g200);transition:var(--t)}.pm-comp:hover{border-color:var(--g400)}
.pm-comp-seller{font-weight:600;font-size:.85rem;color:var(--g800);margin-bottom:2px}
.pm-comp-price{font-family:var(--fd);font-weight:700;font-size:1.1rem;margin-bottom:4px}
.pm-comp-mp{font-size:.7rem;padding:2px 8px;border-radius:10px;font-weight:600;display:inline-block}
.pm-trend{display:inline-flex;align-items:center;gap:3px;font-size:.75rem;font-weight:600;padding:2px 6px;border-radius:8px}
.pm-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.pm-sum-card{padding:14px;border-radius:var(--rs);background:var(--g50);border:1px solid var(--g200);text-align:center}
.pm-sum-val{font-family:var(--fd);font-weight:700;font-size:1.3rem;color:var(--b)}
.pm-sum-lbl{font-size:.7rem;color:var(--g500);text-transform:uppercase;letter-spacing:.5px;margin-top:2px}
.an-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.an-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--g100)}.an-row:last-child{border-bottom:none}
.an-rank{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;flex-shrink:0}
.tooltip-custom{background:var(--w)!important;border:1px solid var(--g200)!important;border-radius:var(--rs)!important;padding:10px 14px!important;box-shadow:var(--shm)!important}
.tooltip-custom .recharts-tooltip-label{font-family:var(--fd);font-weight:600;font-size:.85rem;color:var(--b);margin-bottom:4px}
.tooltip-custom .recharts-tooltip-item{font-size:.8rem!important;padding:1px 0!important}
.notif-panel{position:absolute;top:calc(100% + 8px);right:0;width:400px;max-height:520px;background:var(--w);border:1px solid var(--g200);border-radius:var(--r);box-shadow:var(--shx);z-index:200;overflow:hidden;animation:fu .2s ease forwards}
.notif-header{padding:14px 20px;border-bottom:1px solid var(--g100);display:flex;align-items:center;justify-content:space-between}
.notif-tabs{display:flex;border-bottom:1px solid var(--g100)}.notif-tab{flex:1;padding:10px;text-align:center;font-size:.8rem;font-weight:600;color:var(--g500);cursor:pointer;border-bottom:2px solid transparent;transition:var(--t);background:none;border-top:none;border-left:none;border-right:none;font-family:var(--fb)}.notif-tab.act{color:var(--p);border-bottom-color:var(--p)}
.notif-list{overflow-y:auto;max-height:380px}
.notif-item{display:flex;gap:12px;padding:14px 20px;border-bottom:1px solid var(--g100);transition:var(--t);cursor:pointer}.notif-item:hover{background:var(--g50)}.notif-item.unread{background:#f8faff}
.notif-icon{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.notif-body{flex:1;min-width:0}.notif-title{font-size:.85rem;font-weight:600;color:var(--g800);margin-bottom:2px}.notif-desc{font-size:.8rem;color:var(--g500);line-height:1.4}.notif-time{font-size:.7rem;color:var(--g400);margin-top:4px}
.notif-actions{display:flex;gap:6px;margin-top:8px}
.notif-empty{text-align:center;padding:40px 20px;color:var(--g500)}
.toast-container{position:fixed;bottom:24px;right:24px;z-index:3000;display:flex;flex-direction:column;gap:8px}
.toast{display:flex;align-items:center;gap:12px;padding:14px 20px;border-radius:var(--r);background:var(--w);border:1px solid var(--g200);box-shadow:var(--shl);animation:fu .3s ease forwards;min-width:320px;max-width:440px}
.toast-success{border-left:4px solid var(--ok)}.toast-warning{border-left:4px solid var(--warn)}.toast-error{border-left:4px solid var(--err)}.toast-info{border-left:4px solid var(--p)}
.toast-icon{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.toast-body{flex:1}.toast-title{font-size:.85rem;font-weight:600;color:var(--g800)}.toast-desc{font-size:.8rem;color:var(--g500);margin-top:2px}
.toast-close{background:none;border:none;cursor:pointer;color:var(--g400);padding:4px;transition:var(--t)}.toast-close:hover{color:var(--g700)}
.reprice-modal{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;display:flex;align-items:center;justify-content:center;animation:fi .2s ease}
.reprice-box{background:var(--w);border-radius:var(--rl);padding:32px;width:100%;max-width:480px;box-shadow:var(--shx);animation:fu .3s ease forwards}
.reprice-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--g100)}.reprice-row:last-child{border-bottom:none}
.rule-card{padding:16px;border:1.5px solid var(--g200);border-radius:var(--r);transition:var(--t);margin-bottom:12px}.rule-card:hover{border-color:var(--g400)}
.rule-toggle{width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;position:relative;transition:var(--t);padding:0}.rule-toggle.on{background:var(--p)}.rule-toggle.off{background:var(--g300)}
.rule-toggle::after{content:'';width:20px;height:20px;border-radius:50%;background:white;position:absolute;top:2px;transition:var(--t);box-shadow:0 1px 3px rgba(0,0,0,.2)}.rule-toggle.on::after{left:22px}.rule-toggle.off::after{left:2px}
@media(max-width:768px){.notif-panel{width:calc(100vw - 32px);right:-60px}.toast-container{bottom:16px;right:16px;left:16px}.toast{min-width:auto}.cmd-modal .cmd-box{width:calc(100vw - 32px)}.prof-drop{right:-8px!important;width:220px!important}.detail-panel{width:100%!important;max-width:100%!important}}
.cmd-modal{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2500;display:flex;align-items:flex-start;justify-content:center;padding-top:min(20vh,140px);animation:fi .15s ease}
.cmd-box{width:560px;background:var(--w);border-radius:var(--rl);box-shadow:var(--shx);overflow:hidden;border:1px solid var(--g200)}
.cmd-input-wrap{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid var(--g100)}
.cmd-input{flex:1;border:none;outline:none;font-family:var(--fb);font-size:1rem;color:var(--g800);background:transparent}.cmd-input::placeholder{color:var(--g400)}
.cmd-results{max-height:360px;overflow-y:auto}
.cmd-item{display:flex;align-items:center;gap:12px;padding:12px 20px;cursor:pointer;transition:var(--t)}.cmd-item:hover,.cmd-item.active{background:var(--g50)}
.cmd-item-icon{width:36px;height:36px;border-radius:var(--rs);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cmd-item-title{font-weight:600;font-size:.9rem;color:var(--g800)}.cmd-item-meta{font-size:.75rem;color:var(--g500);margin-top:1px}
.cmd-section{padding:8px 20px 4px;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--g400)}
.cmd-footer{padding:8px 20px;border-top:1px solid var(--g100);display:flex;gap:16px;font-size:.7rem;color:var(--g400)}
.cmd-kbd{padding:1px 6px;background:var(--g100);border:1px solid var(--g200);border-radius:4px;font-family:monospace;font-size:.65rem}
.prof-drop{position:absolute;top:calc(100% + 8px);right:0;width:260px;background:var(--w);border:1px solid var(--g200);border-radius:var(--r);box-shadow:var(--shx);z-index:200;overflow:hidden;animation:fu .2s ease forwards}
.prof-header{padding:16px 20px;border-bottom:1px solid var(--g100);display:flex;align-items:center;gap:12px}
.prof-name{font-weight:700;font-size:.9rem;color:var(--g800)}.prof-email{font-size:.75rem;color:var(--g500);margin-top:1px}
.prof-item{display:flex;align-items:center;gap:10px;padding:10px 20px;font-size:.85rem;color:var(--g600);cursor:pointer;transition:var(--t);border:none;background:none;width:100%;text-align:left;font-family:var(--fb)}.prof-item:hover{background:var(--g50);color:var(--g800)}
.prof-divider{height:1px;background:var(--g100);margin:4px 0}
.detail-panel{position:fixed;top:0;right:0;bottom:0;width:480px;max-width:90vw;background:var(--w);border-left:1px solid var(--g200);box-shadow:-8px 0 30px rgba(0,0,0,.1);z-index:200;overflow-y:auto;animation:slideInR .3s ease forwards}
@keyframes slideInR{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
.detail-header{padding:20px 24px;border-bottom:1px solid var(--g100);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--w);z-index:1}
.detail-body{padding:24px}
.detail-section{margin-bottom:24px}.detail-section-title{font-family:var(--fd);font-weight:700;font-size:.85rem;color:var(--g800);margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px}
.detail-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--g100);font-size:.85rem}.detail-row:last-child{border-bottom:none}
.detail-label{color:var(--g500)}.detail-value{font-weight:600;color:var(--g800)}
.onboard-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:3000;display:flex;align-items:center;justify-content:center;animation:fi .3s ease}
.onboard-box{background:var(--w);border-radius:var(--rl);padding:40px;width:100%;max-width:520px;text-align:center;box-shadow:var(--shx);animation:fu .4s ease forwards}
.onboard-steps{display:flex;gap:6px;justify-content:center;margin:24px 0}
.onboard-dot{width:8px;height:8px;border-radius:50%;transition:var(--t)}.onboard-dot.act{background:var(--p);width:24px;border-radius:4px}.onboard-dot.done{background:var(--g300)}.onboard-dot.pending{background:var(--g200)}
.skel{background:linear-gradient(90deg,var(--g100) 25%,var(--g50) 50%,var(--g100) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:var(--rs)}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.bulk-table{width:100%;border-collapse:separate;border-spacing:0}
.bulk-table th{padding:10px 12px;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--g500);text-align:left;border-bottom:2px solid var(--g200);position:sticky;top:0;background:var(--w);z-index:1}
.bulk-table td{padding:8px 12px;border-bottom:1px solid var(--g100);vertical-align:middle}
.bulk-table tr:hover td{background:var(--g50)}
.bulk-table .bulk-inp{width:100%;padding:8px 10px;border:1px solid var(--g200);border-radius:var(--rs);font-family:var(--fb);font-size:.85rem;color:var(--g800);background:var(--w);outline:none;transition:var(--t)}.bulk-table .bulk-inp:focus{border-color:var(--p);box-shadow:0 0 0 2px var(--pg)}
.bulk-table .bulk-sel{width:100%;padding:8px 10px;border:1px solid var(--g200);border-radius:var(--rs);font-family:var(--fb);font-size:.85rem;color:var(--g800);background:var(--w);outline:none;appearance:none;cursor:pointer}
.bulk-row-num{width:28px;height:28px;border-radius:50%;background:var(--g100);color:var(--g500);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0}
.bulk-progress{margin-top:20px}.bulk-progress-bar{height:8px;background:var(--g200);border-radius:4px;overflow:hidden}.bulk-progress-fill{height:100%;border-radius:4px;background:var(--p);transition:width .5s ease}
.inv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.inv-card{background:var(--w);border:1px solid var(--g200);border-radius:var(--r);padding:20px;transition:var(--t)}.inv-card:hover{box-shadow:var(--shm)}
.inv-bar{height:8px;background:var(--g200);border-radius:4px;overflow:hidden;margin-top:8px}.inv-bar-fill{height:100%;border-radius:4px;transition:width .6s ease}
.inv-alert{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:var(--rs);margin-top:10px;font-size:.8rem;font-weight:600}
@media(max-width:768px){.bulk-table{display:block;overflow-x:auto}.inv-grid{grid-template-columns:1fr}.team-grid{grid-template-columns:1fr!important}.csv-preview{overflow-x:auto}}
.csv-drop{border:2px dashed var(--g300);border-radius:var(--r);padding:48px 24px;text-align:center;cursor:pointer;transition:var(--t);background:var(--g50)}.csv-drop:hover,.csv-drop.drag{border-color:var(--p);background:var(--pg)}.csv-drop input{display:none}
.csv-preview{margin-top:16px;max-height:300px;overflow:auto;border:1px solid var(--g200);border-radius:var(--r)}
.csv-preview table{width:100%;border-collapse:collapse;font-size:.8rem}.csv-preview th{padding:8px 12px;background:var(--g50);font-weight:700;color:var(--g600);text-align:left;border-bottom:2px solid var(--g200);position:sticky;top:0}.csv-preview td{padding:6px 12px;border-bottom:1px solid var(--g100);color:var(--g700)}
.csv-mapping{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--g100)}.csv-mapping:last-child{border-bottom:none}
.scan-area{width:100%;max-width:500px;aspect-ratio:4/3;background:var(--b);border-radius:var(--r);overflow:hidden;position:relative;margin:0 auto}
.scan-area video{width:100%;height:100%;object-fit:cover}
.scan-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}
.scan-box{width:220px;height:100px;border:2px solid rgba(255,255,255,.7);border-radius:8px;box-shadow:0 0 0 9999px rgba(0,0,0,.4)}
.scan-line{position:absolute;top:0;left:0;right:0;height:2px;background:var(--p);animation:scanLine 2s ease-in-out infinite}
@keyframes scanLine{0%,100%{top:10%}50%{top:90%}}
.scan-result{padding:16px;border:1.5px solid var(--g200);border-radius:var(--r);margin-top:16px;animation:fu .3s ease forwards}
.team-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
.team-card{background:var(--w);border:1px solid var(--g200);border-radius:var(--r);padding:20px;transition:var(--t)}.team-card:hover{box-shadow:var(--shm)}
.team-avatar{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:700;font-size:.95rem;flex-shrink:0}
.team-role{padding:3px 10px;border-radius:12px;font-size:.7rem;font-weight:700;letter-spacing:.3px}
.invite-modal .invite-box{background:var(--w);border-radius:var(--rl);padding:32px;width:100%;max-width:440px;box-shadow:var(--shx);animation:fu .3s ease forwards}`;

// ═══ CAMERA ═══
function CameraCapture({ onCapture, onClose }) {
  const vr = useRef(null), cr = useRef(null);
  const [str, setStr] = useState(null), [err, setErr] = useState(null), [fm, setFm] = useState("environment"), [cap, setCap] = useState(null);
  const start = useCallback(async (f) => {
    try { if (str) str.getTracks().forEach(t=>t.stop()); const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:f,width:{ideal:1920},height:{ideal:1440}}}); setStr(s); if(vr.current) vr.current.srcObject=s; setErr(null); } catch { setErr("Camera access denied or unavailable."); }
  }, [str]);
  useEffect(() => { start(fm); return () => { if(str) str.getTracks().forEach(t=>t.stop()); }; }, []);
  const snap = () => { if(!vr.current||!cr.current) return; const v=vr.current,c=cr.current; c.width=v.videoWidth;c.height=v.videoHeight; c.getContext("2d").drawImage(v,0,0); setCap(c.toDataURL("image/jpeg",.92)); };
  return (
    <div className="cm" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{position:"absolute",top:20,right:20}}><button className="cb" onClick={onClose}><X size={24}/></button></div>
      {err ? <div style={{textAlign:"center",color:"white",padding:40}}><CameraOff size={48} style={{marginBottom:16,opacity:.6}}/><p style={{fontSize:"1.1rem",marginBottom:24}}>{err}</p><button className="btn bp" onClick={onClose}>Go Back</button></div>
      : cap ? <>
        <div className="cpv"><img src={cap} style={{width:"100%",height:"100%",objectFit:"contain"}} alt=""/></div>
        <div className="cc"><button className="cb" onClick={()=>setCap(null)}><RotateCcw size={22}/></button><button onClick={()=>{onCapture(cap);setCap(null);}} style={{width:72,height:72,borderRadius:"50%",border:"4px solid white",background:"var(--ok)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Check size={28} color="white"/></button><div style={{width:48}}/></div>
      </> : <>
        <div className="cpv"><video ref={vr} autoPlay playsInline muted style={{transform:fm==="user"?"scaleX(-1)":"none"}}/><canvas ref={cr}/></div>
        <div className="cc"><button className="cb" onClick={()=>{const f=fm==="environment"?"user":"environment";setFm(f);start(f);}}><RefreshCw size={22}/></button><button className="csh" onClick={snap}/><button className="cb" onClick={onClose}><X size={22}/></button></div>
        <p style={{color:"rgba(255,255,255,.6)",marginTop:16,fontSize:".85rem"}}>Position your product and tap the shutter</p>
      </>}
    </div>
  );
}

// ═══ PHOTO ZONE ═══
function PhotoUploadZone({ images, setImages, max=9 }) {
  const fr = useRef(null); const [dov, setDov] = useState(false); const [cam, setCam] = useState(false); const [lbx, setLbx] = useState(null);
  const proc = (files) => { Array.from(files).filter(f=>f.type.startsWith("image/")).slice(0,max-images.length).forEach(file => { const r=new FileReader(); r.onload=e=>{const img=new window.Image();img.onload=()=>setImages(p=>[...p,{id:Date.now()+Math.random(),src:e.target.result,name:file.name,w:img.width,h:img.height,ma:img.width>=1000&&img.height>=1000,mw:img.width>=1000&&img.height>=1000}]);img.src=e.target.result;};r.readAsDataURL(file); }); };
  const camSnap = (d) => { const img=new window.Image();img.onload=()=>setImages(p=>[...p,{id:Date.now(),src:d,name:"camera.jpg",w:img.width,h:img.height,ma:img.width>=1000&&img.height>=1000,mw:img.width>=1000&&img.height>=1000}]);img.src=d;setCam(false); };
  return (<>
    {cam && <CameraCapture onCapture={camSnap} onClose={()=>setCam(false)}/>}
    {lbx && <div className="lb" onClick={()=>setLbx(null)}><button className="lbc"><X size={24}/></button><img src={lbx} alt=""/></div>}
    <div className={`uz ${dov?"dov":""}`} onDragOver={e=>{e.preventDefault();setDov(true);}} onDragLeave={()=>setDov(false)} onDrop={e=>{e.preventDefault();setDov(false);proc(e.dataTransfer.files);}} onClick={()=>fr.current?.click()}>
      <input ref={fr} type="file" accept="image/*" multiple onChange={e=>proc(e.target.files)} style={{display:"none"}}/>
      <Camera size={40} style={{color:"var(--g400)",marginBottom:12}}/>
      <div style={{fontWeight:600,color:"var(--g700)",marginBottom:4}}>Drop photos here or tap to browse</div>
      <div style={{fontSize:".85rem",color:"var(--g500)",marginBottom:16}}>JPEG, PNG up to 10MB — {max-images.length} of {max} slots remaining</div>
      <div style={{display:"flex",gap:8,justifyContent:"center"}} onClick={e=>e.stopPropagation()}>
        <button className="btn bs bsm" onClick={()=>fr.current?.click()}><Upload size={14}/> Upload</button>
        <button className="btn bp bsm" onClick={()=>setCam(true)}><Camera size={14}/> Take Photo</button>
      </div>
    </div>
    {images.length>0 && <>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:20,marginBottom:8}}>
        <span style={{fontSize:".85rem",fontWeight:600,color:"var(--g700)"}}>{images.length} photo{images.length>1?"s":""}</span>
        <span style={{fontSize:".75rem",color:"var(--g500)"}}>First = main listing photo</span>
      </div>
      <div className="pgr">
        {images.map((img,idx)=>(
          <div key={img.id} className={`pi ${idx===0?"pri":""}`}>
            <img src={img.src} alt=""/>
            {idx===0 && <div className="pb">MAIN</div>}
            <div className="pnum">{idx+1}</div>
            <div className="po">
              <button onClick={e=>{e.stopPropagation();setLbx(img.src);}}><ZoomIn size={14}/></button>
              {idx!==0 && <button onClick={e=>{e.stopPropagation();setImages(p=>{const t=p.find(i=>i.id===img.id);return[t,...p.filter(i=>i.id!==img.id)];});}}><Star size={14}/></button>}
              <button onClick={e=>{e.stopPropagation();setImages(p=>p.filter(i=>i.id!==img.id));}}><Trash2 size={14}/></button>
            </div>
            <div style={{position:"absolute",top:8,right:8,display:"flex",gap:3}}>
              <div title={img.ma?"Meets Amazon specs":"Below 1000x1000"} style={{width:18,height:18,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:img.ma?"rgba(16,185,129,.9)":"rgba(239,68,68,.9)",color:"white",fontSize:".55rem",fontWeight:700}}>A</div>
              <div title={img.mw?"Meets Walmart specs":"Below 1000x1000"} style={{width:18,height:18,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:img.mw?"rgba(16,185,129,.9)":"rgba(239,68,68,.9)",color:"white",fontSize:".55rem",fontWeight:700}}>W</div>
            </div>
          </div>
        ))}
        {images.length<max && <div className="pi" style={{display:"flex",alignItems:"center",justifyContent:"center",background:"var(--g50)",border:"2px dashed var(--g300)",cursor:"pointer"}} onClick={()=>fr.current?.click()}><Plus size={24} style={{color:"var(--g400)"}}/></div>}
      </div>
    </>}
  </>);
}

// ═══ ADD PRODUCT WIZARD ═══
function AddProductFlow({ onComplete, onCancel }) {
  const { addProduct } = useProducts();
  const [step, setStep] = useState(1);
  const [imgs, setImgs] = useState([]);
  const [pub, setPub] = useState(false);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({name:"",cat:"",sku:"",price:"",cost:"",desc:"",mp:[],upc:"",brand:"",wt:"",cond:"New"});
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const tgl=(m)=>setF(p=>({...p,mp:p.mp.includes(m)?p.mp.filter(x=>x!==m):[...p.mp,m]}));
  const ok=()=>{if(step===1)return imgs.length>0;if(step===2)return f.name&&f.price&&f.cat;if(step===3)return f.mp.length>0;return true;};
  const mg=f.price&&f.cost?(((parseFloat(f.price)-parseFloat(f.cost))/parseFloat(f.price))*100).toFixed(1):null;
  const go=()=>{setPub(true);setTimeout(()=>{f.mp.forEach(m=>addProduct({name:f.name,category:f.cat,price:f.price,cost:f.cost,sku:f.sku,description:f.desc,marketplace:m==="amazon"?"Amazon":"Walmart",status:"active",images:imgs.map(i=>i.src)}));setPub(false);setDone(true);},2500);};
  const steps=[{n:1,l:"Photos"},{n:2,l:"Details"},{n:3,l:"Marketplace"},{n:4,l:"Publish"}];
  const reset=()=>{setStep(1);setImgs([]);setF({name:"",cat:"",sku:"",price:"",cost:"",desc:"",mp:[],upc:"",brand:"",wt:"",cond:"New"});setDone(false);};

  return (
    <div style={{maxWidth:720,margin:"0 auto"}}>
      <div className="stp">{steps.map((s,i)=>(<div key={s.n} className="stp-s"><div className={`stp-c ${step>s.n?"c":step===s.n?"a":"i"}`}>{step>s.n?<Check size={16}/>:s.n}</div><span className="stp-l">{s.l}</span>{i<3&&<div className={`stp-ln ${step>s.n?"c":""}`}/>}</div>))}</div>

      {step===1 && <div className="pn"><div className="pnh"><span className="pnt">Product Photos</span><span style={{fontSize:".8rem",color:"var(--g500)"}}>Up to 9</span></div><div className="pnb">
        <PhotoUploadZone images={imgs} setImages={setImgs} max={9}/>
        {imgs.length>0 && <div style={{background:"var(--g50)",border:"1px solid var(--g200)",borderRadius:"var(--r)",padding:20,marginTop:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Info size={16} style={{color:"var(--p)"}}/><span style={{fontSize:".85rem",fontWeight:600,color:"var(--g700)"}}>Image Requirements</span></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>{Object.entries(MP_SPECS).map(([k,s])=>(<div key={k} style={{padding:12,borderRadius:"var(--rs)",background:s.bg,border:`1px solid ${s.color}20`}}><div style={{fontWeight:700,color:s.color,fontSize:".85rem",marginBottom:8}}>{s.name}</div><div style={{fontSize:".8rem",color:"var(--g600)",lineHeight:1.8}}>Min: {s.min}x{s.min}px<br/>Format: {s.format}<br/>Background: {s.bgReq}</div></div>))}</div>
        </div>}
      </div></div>}

      {step===2 && <div className="pn"><div className="pnh"><span className="pnt">Product Details</span></div><div className="pnb">
        <div className="ig"><label>Product Title *</label><input className="inp" placeholder="e.g., Wireless Bluetooth Earbuds" value={f.name} onChange={e=>u("name",e.target.value)}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div className="ig"><label>Category *</label><select className="sel" value={f.cat} onChange={e=>u("cat",e.target.value)}><option value="">Select</option><option>Electronics</option><option>Home & Garden</option><option>Clothing</option><option>Toys & Games</option><option>Sports & Outdoors</option><option>Beauty</option><option>Automotive</option><option>Books</option><option>Health</option><option>Pet Supplies</option><option>Office</option><option>Other</option></select></div>
          <div className="ig"><label>Condition</label><select className="sel" value={f.cond} onChange={e=>u("cond",e.target.value)}><option>New</option><option>Refurbished</option><option>Used - Like New</option><option>Used - Good</option></select></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          <div className="ig"><label>Your Price *</label><div className="iw"><input className="inp" placeholder="0.00" value={f.price} onChange={e=>u("price",e.target.value)} style={{paddingLeft:28}}/><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"var(--g400)",fontWeight:600}}>$</span></div></div>
          <div className="ig"><label>Cost / Unit</label><div className="iw"><input className="inp" placeholder="0.00" value={f.cost} onChange={e=>u("cost",e.target.value)} style={{paddingLeft:28}}/><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"var(--g400)",fontWeight:600}}>$</span></div></div>
          <div className="ig"><label>Margin</label><div className="inp" style={{background:"var(--g50)",display:"flex",alignItems:"center",color:mg&&parseFloat(mg)>0?"var(--ok)":"var(--g400)",fontWeight:600}}>{mg?`${mg}%`:"—"}</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div className="ig"><label>SKU</label><input className="inp" placeholder="Internal SKU" value={f.sku} onChange={e=>u("sku",e.target.value)}/></div>
          <div className="ig"><label>UPC / Barcode</label><input className="inp" placeholder="UPC, EAN, or ISBN" value={f.upc} onChange={e=>u("upc",e.target.value)}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div className="ig"><label>Brand</label><input className="inp" placeholder="Brand name" value={f.brand} onChange={e=>u("brand",e.target.value)}/></div>
          <div className="ig"><label>Weight (lbs)</label><input className="inp" placeholder="0.0" value={f.wt} onChange={e=>u("wt",e.target.value)}/></div>
        </div>
        <div className="ig"><label>Description</label>
          <AIDescriptionWriter productName={f.name} category={f.cat} onGenerate={({title, description}) => { if(title) u("name", title); u("desc", description); }}/>
          <textarea className="ta" rows={4} placeholder="Features, specifications, what's included..." value={f.desc} onChange={e=>u("desc",e.target.value)}/></div>
      </div></div>}

      {step===3 && <div className="pn"><div className="pnh"><span className="pnt">Choose Marketplace</span><span style={{fontSize:".8rem",color:"var(--g500)"}}>One or both</span></div><div className="pnb">
        <div className="mps">
          <div className={`mpo ${f.mp.includes("amazon")?"sa":""}`} onClick={()=>tgl("amazon")}><ShoppingCart size={32} style={{color:"var(--am)"}}/><div className="mpn" style={{color:f.mp.includes("amazon")?"var(--am)":"var(--g700)"}}>Amazon</div><div style={{fontSize:".8rem",color:"var(--g500)",marginTop:4}}>Seller Central</div>{f.mp.includes("amazon")&&<CheckCircle size={18} style={{color:"var(--am)",marginTop:8}}/>}</div>
          <div className={`mpo ${f.mp.includes("walmart")?"sw":""}`} onClick={()=>tgl("walmart")}><Globe size={32} style={{color:"var(--wm)"}}/><div className="mpn" style={{color:f.mp.includes("walmart")?"var(--wm)":"var(--g700)"}}>Walmart</div><div style={{fontSize:".8rem",color:"var(--g500)",marginTop:4}}>Marketplace</div>{f.mp.includes("walmart")&&<CheckCircle size={18} style={{color:"var(--wm)",marginTop:8}}/>}</div>
        </div>
        {f.mp.length>0 && <div style={{background:"var(--g50)",borderRadius:"var(--r)",padding:20,marginTop:16}}>
          <div style={{fontWeight:700,fontSize:".9rem",marginBottom:16,color:"var(--g800)"}}>Summary</div>
          {[["Product",f.name||"—"],["Price","$"+(f.price||"—")],["Photos",imgs.length+" image"+(imgs.length!==1?"s":"")],["To",f.mp.map(m=>m==="amazon"?"Amazon":"Walmart").join(" & ")]].map(([l,v],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:".85rem",padding:"4px 0"}}><span style={{color:"var(--g500)"}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>)}
          {mg&&<div style={{display:"flex",justifyContent:"space-between",fontSize:".85rem",padding:"4px 0"}}><span style={{color:"var(--g500)"}}>Margin</span><span style={{fontWeight:600,color:"var(--ok)"}}>{mg}%</span></div>}
        </div>}
      </div></div>}

      {step===4 && <div className="pn"><div className="pnb">
        {pub?<div className="ss"><div className="psp"/><h3 style={{fontFamily:"var(--fd)",fontWeight:700,marginBottom:8}}>Publishing...</h3><p style={{color:"var(--g500)"}}>Uploading images and creating your listing.</p></div>
        :done?<div className="ss"><div className="ssi"><CheckCircle size={40}/></div><h3 style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:"1.5rem",marginBottom:8}}>Listed Successfully!</h3><p style={{color:"var(--g500)",marginBottom:32}}>"{f.name}" is live on {f.mp.map(m=>m==="amazon"?"Amazon":"Walmart").join(" & ")}.</p><div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}><button className="btn bp" onClick={reset}><Plus size={16}/> Add Another</button><button className="btn bs" onClick={()=>onComplete?.()}><Package size={16}/> View Listings</button></div></div>:null}
      </div></div>}

      {!pub&&!done&&<div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>
        <button className="btn bg" onClick={()=>step===1?onCancel?.():setStep(s=>s-1)}>{step===1?"Cancel":"Back"}</button>
        <button className="btn bp" disabled={!ok()} onClick={()=>{if(step===3){setStep(4);go();}else setStep(s=>s+1);}}>{step===3?"Publish Listing":"Continue"} <ChevronRight size={16}/></button>
      </div>}
    </div>
  );
}

// ═══ PHASE 4: TOAST NOTIFICATION SYSTEM ═══
const ToastContext = createContext(null);
const useToast = () => useContext(ToastContext);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = (toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), toast.duration || 4000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  return <ToastContext.Provider value={{ addToast }}>{children}
    <div className="toast-container">{toasts.map(t => (
      <div key={t.id} className={`toast toast-${t.type || "info"}`}>
        <div className="toast-icon" style={{ background: t.type === "success" ? "#ecfdf5" : t.type === "warning" ? "#fffbeb" : t.type === "error" ? "#fef2f2" : "#eff6ff", color: t.type === "success" ? "var(--ok)" : t.type === "warning" ? "var(--warn)" : t.type === "error" ? "var(--err)" : "var(--p)" }}>
          {t.type === "success" ? <CheckCircle size={18}/> : t.type === "warning" ? <AlertTriangle size={18}/> : t.type === "error" ? <X size={18}/> : <Bell size={18}/>}
        </div>
        <div className="toast-body"><div className="toast-title">{t.title}</div>{t.desc && <div className="toast-desc">{t.desc}</div>}</div>
        <button className="toast-close" onClick={() => removeToast(t.id)}><X size={16}/></button>
      </div>
    ))}</div>
  </ToastContext.Provider>;
}

// ═══ PHASE 4: NOTIFICATION DATA ═══
const NOTIFICATIONS = [
  { id:"n1", type:"price-drop", title:"Competitor Price Drop", desc:"DeskGear Co dropped Phone Stand to $13.99 on Amazon — you're now $2.00 above.", time:"12 min ago", unread:true, product:"p3", urgency:"high", action:"reprice" },
  { id:"n2", type:"price-drop", title:"New Undercut Detected", desc:"TechStand Direct listed Phone Stand at $12.99 — lowest price in 30 days.", time:"25 min ago", unread:true, product:"p3", urgency:"high", action:"reprice" },
  { id:"n3", type:"opportunity", title:"Price Increase Opportunity", desc:"All USB-C Hub competitors raised prices. You could increase to $31.99 and add $2.99/unit profit.", time:"1 hr ago", unread:true, product:"p4", urgency:"medium", action:"reprice" },
  { id:"n4", type:"winning", title:"You Won the Buy Box!", desc:"Wireless Earbuds — you're now the featured seller on Amazon.", time:"1 hr ago", unread:false, product:"p1", urgency:"low", action:null },
  { id:"n5", type:"new-competitor", title:"New Competitor Found", desc:"PhotoGear Hub is now selling LED Ring Light on Walmart at $19.99.", time:"3 hrs ago", unread:false, product:"p2", urgency:"medium", action:"view" },
  { id:"n6", type:"opportunity", title:"Competitor Out of Stock", desc:"AudioMax Store's Wireless Earbuds listing is out of stock on Walmart — opportunity to capture their sales.", time:"4 hrs ago", unread:false, product:"p1", urgency:"medium", action:null },
  { id:"n7", type:"daily-report", title:"Daily Price Report", desc:"3 products monitored. 2 price changes detected. 1 action recommended.", time:"6 hrs ago", unread:false, product:null, urgency:"low", action:null },
  { id:"n8", type:"price-drop", title:"Price War Alert", desc:"YogaPro Supply dropped Yoga Mat to $18.49 — $1.50 below your price.", time:"8 hrs ago", unread:false, product:"p5", urgency:"medium", action:"reprice" },
];

// ═══ PHASE 4: NOTIFICATION CENTER ═══
function NotificationCenter({ isOpen, onClose, onAction, goToTab }) {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? notifications : filter === "unread" ? notifications.filter(n => n.unread) : notifications.filter(n => n.urgency === "high");
  const unreadCount = notifications.filter(n => n.unread).length;

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const markAllRead = () => { setNotifications(prev => prev.map(n => ({ ...n, unread: false }))); addToast({ type: "success", title: "All caught up", desc: "All notifications marked as read." }); };
  const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  const iconMap = { "price-drop": { bg: "#fef2f2", color: "var(--err)", icon: <ArrowDown size={16}/> }, opportunity: { bg: "#ecfdf5", color: "var(--ok)", icon: <ArrowUp size={16}/> }, winning: { bg: "#eff6ff", color: "var(--p)", icon: <Star size={16}/> }, "new-competitor": { bg: "#fffbeb", color: "var(--warn)", icon: <Eye size={16}/> }, "daily-report": { bg: "var(--g100)", color: "var(--g600)", icon: <BarChart3 size={16}/> } };

  if (!isOpen) return null;

  return (<div className="notif-panel" onClick={e => e.stopPropagation()}>
    <div className="notif-header">
      <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".95rem" }}>Notifications {unreadCount > 0 && <span style={{ background: "var(--err)", color: "white", borderRadius: 10, padding: "1px 7px", fontSize: ".7rem", marginLeft: 6 }}>{unreadCount}</span>}</span>
      <div style={{ display: "flex", gap: 8 }}>
        {unreadCount > 0 && <button className="btn bg bsm" style={{ padding: "4px 8px", fontSize: ".7rem" }} onClick={markAllRead}>Mark all read</button>}
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--g400)" }} onClick={onClose}><X size={18}/></button>
      </div>
    </div>
    <div className="notif-tabs">
      {[{ k: "all", l: `All (${notifications.length})` }, { k: "unread", l: `Unread (${unreadCount})` }, { k: "urgent", l: "Urgent" }].map(f => (
        <button key={f.k} className={`notif-tab ${filter === f.k ? "act" : ""}`} onClick={() => setFilter(f.k)}>{f.l}</button>
      ))}
    </div>
    <div className="notif-list">
      {filtered.length === 0 ? <div className="notif-empty"><Bell size={32} style={{ opacity: .3, marginBottom: 8 }}/><p style={{ fontSize: ".85rem" }}>{filter === "unread" ? "No unread notifications" : "No notifications"}</p></div>
      : filtered.map(n => {
        const ic = iconMap[n.type] || iconMap["daily-report"];
        return (
          <div key={n.id} className={`notif-item ${n.unread ? "unread" : ""}`} onClick={() => markRead(n.id)}>
            <div className="notif-icon" style={{ background: ic.bg, color: ic.color }}>{ic.icon}</div>
            <div className="notif-body">
              <div className="notif-title">{n.title}{n.urgency === "high" && <span style={{ color: "var(--err)", marginLeft: 6, fontSize: ".7rem" }}>URGENT</span>}</div>
              <div className="notif-desc">{n.desc}</div>
              <div className="notif-time">{n.time}</div>
              <div className="notif-actions">
                {n.action === "reprice" && <button className="btn bp bsm" style={{ padding: "3px 10px", fontSize: ".7rem" }} onClick={e => { e.stopPropagation(); markRead(n.id); onAction("reprice", n.product); }}>Adjust Price</button>}
                {n.action === "view" && <button className="btn bs bsm" style={{ padding: "3px 10px", fontSize: ".7rem" }} onClick={e => { e.stopPropagation(); markRead(n.id); goToTab("pricing"); onClose(); }}>View Details</button>}
                <button className="btn bg bsm" style={{ padding: "3px 8px", fontSize: ".7rem" }} onClick={e => { e.stopPropagation(); dismiss(n.id); }}>Dismiss</button>
              </div>
            </div>
            {n.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--p)", flexShrink: 0, marginTop: 4 }}/>}
          </div>
        );
      })}
    </div>
  </div>);
}

// ═══ PHASE 4: REPRICING MODAL ═══
function RepriceModal({ productId, onClose }) {
  const { products, addProduct } = useProducts();
  const { addToast } = useToast();
  const data = COMPETITOR_DATA[productId];
  const product = products.find(p => p.id === productId);
  const [newPrice, setNewPrice] = useState(data ? data.yourPrice.toFixed(2) : "");
  const [strategy, setStrategy] = useState("recommended");
  const [applying, setApplying] = useState(false);
  const [done, setDone] = useState(false);

  if (!data || !product) return null;

  const lowest = Math.min(...data.competitors.map(c => c.price));
  const recommended = data.recommendation === "increase" ? Math.min(...data.competitors.filter(c => c.price > data.yourPrice).map(c => c.price), data.yourPrice + 3).toFixed(2)
    : data.recommendation === "decrease" ? (lowest - 0.50).toFixed(2) : data.yourPrice.toFixed(2);
  const beatLowest = (lowest - 0.01).toFixed(2);
  const matchLowest = lowest.toFixed(2);

  const strategies = [
    { id: "recommended", label: "Recommended", price: recommended, desc: data.recText.split(".")[0] + ".", color: data.recommendation === "increase" ? "var(--ok)" : data.recommendation === "decrease" ? "var(--err)" : "var(--p)" },
    { id: "beat", label: "Beat Lowest", price: beatLowest, desc: `Undercut the lowest competitor by $0.01.`, color: "var(--warn)" },
    { id: "match", label: "Match Lowest", price: matchLowest, desc: `Match the lowest competitor at $${matchLowest}.`, color: "var(--g600)" },
    { id: "custom", label: "Custom Price", price: newPrice, desc: "Set your own price.", color: "var(--p)" },
  ];

  const selected = strategies.find(s => s.id === strategy);
  const finalPrice = strategy === "custom" ? newPrice : selected.price;
  const newMargin = finalPrice && product.cost ? (((parseFloat(finalPrice) - parseFloat(product.cost)) / parseFloat(finalPrice)) * 100).toFixed(1) : null;
  const priceDiff = finalPrice ? (parseFloat(finalPrice) - data.yourPrice).toFixed(2) : 0;

  const apply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setDone(true);
      addToast({ type: "success", title: "Price Updated!", desc: `${product.name} repriced to $${finalPrice} on ${product.marketplace}.` });
      setTimeout(() => onClose(), 1500);
    }, 1800);
  };

  return (<div className="reprice-modal" onClick={onClose}>
    <div className="reprice-box" onClick={e => e.stopPropagation()}>
      {done ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#ecfdf5", color: "var(--ok)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "cm .5s ease" }}><CheckCircle size={32}/></div>
          <h3 style={{ fontFamily: "var(--fd)", fontWeight: 700, marginBottom: 4 }}>Price Updated!</h3>
          <p style={{ color: "var(--g500)", fontSize: ".9rem" }}>${data.yourPrice.toFixed(2)} → ${finalPrice} on {product.marketplace}</p>
        </div>
      ) : applying ? (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div style={{ width: 48, height: 48, border: "3px solid var(--g200)", borderTopColor: "var(--p)", borderRadius: "50%", animation: "sp .8s linear infinite", margin: "0 auto 16px" }}/>
          <p style={{ fontWeight: 600 }}>Updating price on {product.marketplace}...</p>
        </div>
      ) : (<>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div><h3 style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.1rem" }}>Adjust Price</h3><p style={{ color: "var(--g500)", fontSize: ".85rem" }}>{product.name}</p></div>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--g400)" }} onClick={onClose}><X size={20}/></button>
        </div>

        {/* Current Price */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1, padding: 14, borderRadius: "var(--rs)", background: "var(--g50)", border: "1px solid var(--g200)", textAlign: "center" }}>
            <div style={{ fontSize: ".75rem", color: "var(--g500)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Current</div>
            <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.3rem" }}>${data.yourPrice.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}><ArrowRight size={20} style={{ color: "var(--g400)" }}/></div>
          <div style={{ flex: 1, padding: 14, borderRadius: "var(--rs)", background: parseFloat(priceDiff) > 0 ? "#ecfdf5" : parseFloat(priceDiff) < 0 ? "#fef2f2" : "var(--g50)", border: `1px solid ${parseFloat(priceDiff) > 0 ? "#a7f3d0" : parseFloat(priceDiff) < 0 ? "#fecaca" : "var(--g200)"}`, textAlign: "center" }}>
            <div style={{ fontSize: ".75rem", color: "var(--g500)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>New</div>
            <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.3rem", color: parseFloat(priceDiff) > 0 ? "var(--ok)" : parseFloat(priceDiff) < 0 ? "var(--err)" : "var(--b)" }}>${finalPrice}</div>
          </div>
        </div>

        {/* Strategy Cards */}
        <div style={{ marginBottom: 20 }}>
          {strategies.map(s => (
            <div key={s.id} className="rule-card" style={{ cursor: "pointer", borderColor: strategy === s.id ? "var(--p)" : undefined, background: strategy === s.id ? "var(--pg)" : undefined }} onClick={() => { setStrategy(s.id); if (s.id !== "custom") setNewPrice(s.price); }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><div style={{ fontWeight: 600, fontSize: ".85rem", color: strategy === s.id ? "var(--p)" : "var(--g800)" }}>{s.label}</div><div style={{ fontSize: ".8rem", color: "var(--g500)", marginTop: 2 }}>{s.desc}</div></div>
                <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1rem", color: s.color }}>${s.price}</span>
              </div>
              {s.id === "custom" && strategy === "custom" && (
                <div style={{ marginTop: 12 }}><div className="iw"><input className="inp" value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{ paddingLeft: 28 }} placeholder="0.00"/><span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--g400)", fontWeight: 600 }}>$</span></div></div>
              )}
            </div>
          ))}
        </div>

        {/* Impact Summary */}
        <div style={{ background: "var(--g50)", borderRadius: "var(--rs)", padding: 14, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem", marginBottom: 6 }}><span style={{ color: "var(--g500)" }}>Price Change</span><span style={{ fontWeight: 600, color: parseFloat(priceDiff) > 0 ? "var(--ok)" : parseFloat(priceDiff) < 0 ? "var(--err)" : "var(--g600)" }}>{parseFloat(priceDiff) > 0 ? "+" : ""}{priceDiff}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem", marginBottom: 6 }}><span style={{ color: "var(--g500)" }}>New Margin</span><span style={{ fontWeight: 600, color: parseFloat(newMargin) > 20 ? "var(--ok)" : "var(--warn)" }}>{newMargin}%</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem" }}><span style={{ color: "var(--g500)" }}>vs Lowest Competitor</span><span style={{ fontWeight: 600, color: parseFloat(finalPrice) <= lowest ? "var(--ok)" : "var(--err)" }}>{parseFloat(finalPrice) <= lowest ? "You're the lowest" : `$${(parseFloat(finalPrice) - lowest).toFixed(2)} above`}</span></div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn bs" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancel</button>
          <button className="btn bp" style={{ flex: 1, justifyContent: "center" }} onClick={apply} disabled={!finalPrice || parseFloat(finalPrice) <= 0}>
            <DollarSign size={16}/> Apply Price Change
          </button>
        </div>
      </>)}
    </div>
  </div>);
}

// ═══ PHASE 4: ALERT RULES MANAGER ═══
function AlertRules() {
  const { addToast } = useToast();
  const [rules, setRules] = useState([
    { id: "r1", name: "Undercut Alert", desc: "Notify when any competitor prices below yours", enabled: true, threshold: "any", frequency: "instant" },
    { id: "r2", name: "Price Drop > 10%", desc: "Alert when a competitor drops price by more than 10%", enabled: true, threshold: "10%", frequency: "instant" },
    { id: "r3", name: "New Competitor", desc: "Notify when a new seller lists the same product", enabled: true, threshold: "any", frequency: "daily" },
    { id: "r4", name: "Buy Box Lost", desc: "Alert immediately when you lose the Buy Box", enabled: true, threshold: "any", frequency: "instant" },
    { id: "r5", name: "Price Increase Opportunity", desc: "Notify when all competitors raise prices", enabled: false, threshold: "any", frequency: "daily" },
    { id: "r6", name: "Daily Price Summary", desc: "Receive a daily digest of all price changes", enabled: true, threshold: "any", frequency: "daily" },
    { id: "r7", name: "Competitor Out of Stock", desc: "Alert when a competitor's listing goes out of stock", enabled: false, threshold: "any", frequency: "instant" },
  ]);

  const toggle = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    const rule = rules.find(r => r.id === id);
    addToast({ type: "success", title: `Rule ${rule.enabled ? "disabled" : "enabled"}`, desc: rule.name });
  };

  return (<div className="pn" style={{ maxWidth: 640 }}>
    <div className="pnh"><span className="pnt">Alert Rules</span><span style={{ fontSize: ".75rem", color: "var(--g500)" }}>{rules.filter(r => r.enabled).length} of {rules.length} active</span></div>
    <div className="pnb">
      {rules.map(r => (
        <div key={r.id} className="rule-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: ".9rem", color: r.enabled ? "var(--g800)" : "var(--g400)" }}>{r.name}</span>
                <span className="badge" style={{ background: r.frequency === "instant" ? "#fef2f2" : "#eff6ff", color: r.frequency === "instant" ? "var(--err)" : "var(--p)", fontSize: ".65rem" }}>{r.frequency === "instant" ? "Instant" : "Daily"}</span>
              </div>
              <div style={{ fontSize: ".8rem", color: "var(--g500)", marginTop: 4 }}>{r.desc}</div>
            </div>
            <button className={`rule-toggle ${r.enabled ? "on" : "off"}`} onClick={() => toggle(r.id)} aria-label={`Toggle ${r.name}`}/>
          </div>
        </div>
      ))}
    </div>
  </div>);
}

// ═══ PHASE 3: PRICE MONITOR ═══
function PriceMonitor() {
  const {products} = useProducts();
  const [sel, setSel] = useState("p1");
  const [timeRange, setTimeRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  const data = COMPETITOR_DATA[sel];
  const lowestComp = data ? Math.min(...data.competitors.map(c=>c.price)) : 0;
  const highestComp = data ? Math.max(...data.competitors.map(c=>c.price)) : 0;
  const avgComp = data ? (data.competitors.reduce((s,c)=>s+c.price,0)/data.competitors.length).toFixed(2) : 0;
  const margin = data ? (((data.yourPrice - data.cost)/data.yourPrice)*100).toFixed(1) : 0;
  const position = data ? (data.competitors.filter(c=>c.price < data.yourPrice).length + 1) : 0;
  const totalSellers = data ? data.competitors.length + 1 : 1;

  const refresh = () => { setRefreshing(true); setTimeout(()=>setRefreshing(false), 1500); };

  const recColors = { increase: {bg:"#ecfdf5",border:"#a7f3d0",color:"#059669",icon:<ArrowUp size={18}/>}, decrease: {bg:"#fef2f2",border:"#fecaca",color:"#dc2626",icon:<ArrowDown size={18}/>}, hold: {bg:"#eff6ff",border:"#bfdbfe",color:"#2563eb",icon:<Minus size={18}/>} };
  const rc = data ? recColors[data.recommendation] : recColors.hold;

  const CustomTooltip = ({active,payload,label}) => {
    if(!active||!payload?.length) return null;
    return <div style={{background:"white",border:"1px solid #e9ecef",borderRadius:8,padding:"10px 14px",boxShadow:"0 4px 12px rgba(0,0,0,.08)"}}>
      <div style={{fontFamily:"var(--fd)",fontWeight:600,fontSize:".85rem",marginBottom:6}}>{label}</div>
      {payload.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:".8rem",padding:"2px 0"}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:p.color}}/><span style={{color:"var(--g500)"}}>{p.name}:</span><span style={{fontWeight:600}}>${p.value?.toFixed(2)}</span>
      </div>)}
    </div>;
  };

  const prodList = Object.keys(COMPETITOR_DATA).map(id => {
    const d = COMPETITOR_DATA[id];
    const prod = products.find(p=>p.id===id);
    return { id, name: d.name, mp: prod?.marketplace||"Amazon", rec: d.recommendation, yourPrice: d.yourPrice, lowest: Math.min(...d.competitors.map(c=>c.price)), alerts: d.competitors.filter(c=>c.price<d.yourPrice).length };
  });

  return (<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
      <div><span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:"1.1rem",color:"var(--b)"}}>Price Intelligence</span><span style={{fontSize:".8rem",color:"var(--g500)",marginLeft:8}}>Last scan: 12 min ago</span></div>
      <button className="btn bs bsm" onClick={refresh} disabled={refreshing}><RefreshCw size={14} style={{animation:refreshing?"sp .8s linear infinite":"none"}}/> {refreshing?"Scanning...":"Refresh Prices"}</button>
    </div>

    <div className="pm-grid">
      {/* Product List */}
      <div>
        <div className="pn"><div className="pnh"><span className="pnt">Your Products</span><span style={{fontSize:".75rem",color:"var(--g500)"}}>{prodList.length} tracked</span></div>
          <div className="pnb" style={{padding:"12px 16px"}}>
            <div className="pm-list">{prodList.map(p=>(
              <div key={p.id} className={`pm-item ${sel===p.id?"sel":""}`} onClick={()=>setSel(p.id)}>
                <div className="pm-item-name">{p.name}</div>
                <div className="pm-item-meta">
                  <span style={{color:p.mp==="Amazon"?"var(--am)":"var(--wm)",fontWeight:600}}>{p.mp}</span>
                  <span style={{color:"var(--g400)"}}>·</span>
                  <span style={{fontWeight:600}}>${p.yourPrice.toFixed(2)}</span>
                  {p.alerts>0 && <span style={{background:"#fef2f2",color:"var(--err)",padding:"1px 6px",borderRadius:8,fontSize:".7rem",fontWeight:600}}>{p.alerts} undercut{p.alerts>1?"s":""}</span>}
                  <span className="pm-trend" style={{background:p.rec==="increase"?"#ecfdf5":p.rec==="decrease"?"#fef2f2":"#eff6ff",color:p.rec==="increase"?"#059669":p.rec==="decrease"?"#dc2626":"#2563eb",marginLeft:"auto"}}>
                    {p.rec==="increase"?<ArrowUp size={10}/>:p.rec==="decrease"?<ArrowDown size={10}/>:<Minus size={10}/>}{p.rec}
                  </span>
                </div>
              </div>
            ))}</div>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {data && <div>
        {/* Recommendation */}
        <div className={`pm-rec pm-rec-${data.recommendation}`}>
          <div style={{width:36,height:36,borderRadius:"50%",background:rc.color+"18",color:rc.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{rc.icon}</div>
          <div><div style={{fontWeight:700,fontSize:".9rem",color:rc.color,textTransform:"capitalize",marginBottom:4}}>Recommendation: {data.recommendation} Price</div><div style={{fontSize:".85rem",color:"var(--g700)",lineHeight:1.5}}>{data.recText}</div></div>
        </div>

        {/* Summary Cards */}
        <div className="pm-summary">
          <div className="pm-sum-card"><div className="pm-sum-val" style={{color:"var(--p)"}}>${data.yourPrice.toFixed(2)}</div><div className="pm-sum-lbl">Your Price</div></div>
          <div className="pm-sum-card"><div className="pm-sum-val" style={{color:lowestComp<data.yourPrice?"var(--err)":"var(--ok)"}}>${lowestComp.toFixed(2)}</div><div className="pm-sum-lbl">Lowest</div></div>
          <div className="pm-sum-card"><div className="pm-sum-val">${avgComp}</div><div className="pm-sum-lbl">Average</div></div>
          <div className="pm-sum-card"><div className="pm-sum-val" style={{color:data.buyBox?"var(--ok)":"var(--err)"}}>{data.buyBox?"Yes":"No"}</div><div className="pm-sum-lbl">Buy Box</div></div>
        </div>

        {/* Price History Chart */}
        <div className="pn" style={{marginBottom:20}}>
          <div className="pnh"><span className="pnt">30-Day Price History</span>
            <div style={{display:"flex",gap:4}}>{["7d","14d","30d"].map(r=><button key={r} className={`btn bsm ${timeRange===r?"bp":"bs"}`} style={{padding:"4px 10px",fontSize:".7rem"}} onClick={()=>setTimeRange(r)}>{r}</button>)}</div>
          </div>
          <div className="pnb" style={{padding:"16px 16px 8px 0"}}>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.history.slice(timeRange==="7d"?-7:timeRange==="14d"?-14:-30)}>
                <defs>
                  <linearGradient id="gYou" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gLow" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" vertical={false}/>
                <XAxis dataKey="day" tick={{fontSize:11,fill:"#868e96"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:"#868e96"}} axisLine={false} tickLine={false} domain={["auto","auto"]} tickFormatter={v=>`$${v}`}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area type="monotone" dataKey="you" name="Your Price" stroke="#2563eb" strokeWidth={2.5} fill="url(#gYou)" dot={false}/>
                <Area type="monotone" dataKey="low" name="Lowest" stroke="#ef4444" strokeWidth={1.5} fill="url(#gLow)" dot={false} strokeDasharray="4 4"/>
                <Line type="monotone" dataKey="avg" name="Market Avg" stroke="#868e96" strokeWidth={1} dot={false} strokeDasharray="3 3"/>
              </AreaChart>
            </ResponsiveContainer>
            <div style={{display:"flex",gap:16,justifyContent:"center",paddingBottom:4}}>
              {[{c:"#2563eb",l:"Your Price"},{c:"#ef4444",l:"Lowest Competitor"},{c:"#868e96",l:"Market Average"}].map(x=><div key={x.l} style={{display:"flex",alignItems:"center",gap:6,fontSize:".75rem",color:"var(--g500)"}}><div style={{width:12,height:3,borderRadius:2,background:x.c}}/>{x.l}</div>)}
            </div>
          </div>
        </div>

        {/* Competitors */}
        <div className="pn">
          <div className="pnh"><span className="pnt">Competitors ({data.competitors.length})</span><span style={{fontSize:".75rem",color:"var(--g500)"}}>#{position} of {totalSellers} sellers</span></div>
          <div className="pnb">
            <div className="pm-comp-grid">{data.competitors.map((c,i)=>(
              <div key={i} className="pm-comp">
                <div className="pm-comp-seller">{c.seller}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span className="pm-comp-price" style={{color:c.price<data.yourPrice?"var(--err)":c.price>data.yourPrice?"var(--ok)":"var(--g700)"}}>${c.price.toFixed(2)}</span>
                  <span className="pm-trend" style={{background:c.trend==="up"?"#ecfdf5":c.trend==="down"?"#fef2f2":"var(--g100)",color:c.trend==="up"?"#059669":c.trend==="down"?"#dc2626":"var(--g500)"}}>
                    {c.trend==="up"?<ArrowUp size={10}/>:c.trend==="down"?<ArrowDown size={10}/>:<Minus size={10}/>}
                    {c.change!==0&&`$${Math.abs(c.change).toFixed(2)}`}{c.trend==="stable"&&"stable"}
                  </span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
                  <span className="pm-comp-mp" style={{background:c.mp==="Amazon"?"#FFF8EC":"#EBF4FF",color:c.mp==="Amazon"?"var(--am)":"var(--wm)"}}>{c.mp}</span>
                  <span style={{fontSize:".7rem",color:"var(--g400)"}}>{c.lastChecked}</span>
                </div>
                {c.price<data.yourPrice && <div style={{marginTop:6,fontSize:".75rem",color:"var(--err)",fontWeight:600}}>Undercuts you by ${(data.yourPrice-c.price).toFixed(2)}</div>}
              </div>
            ))}</div>
          </div>
        </div>
      </div>}
    </div>
  </div>);
}

// ═══ PHASE 3: ANALYTICS DASHBOARD ═══
function AnalyticsDash() {
  const {products} = useProducts();
  const [period, setPeriod] = useState("30d");
  const data = ANALYTICS_DATA;

  const totalRev = data.revenue.reduce((s,d)=>s+d.revenue,0);
  const totalOrders = data.revenue.reduce((s,d)=>s+d.orders,0);
  const avgOrder = totalOrders>0?(totalRev/totalOrders).toFixed(2):0;
  const priceAlerts = Object.values(COMPETITOR_DATA).filter(d=>d.recommendation==="decrease").length;

  const CustomTooltip = ({active,payload,label}) => {
    if(!active||!payload?.length) return null;
    return <div style={{background:"white",border:"1px solid #e9ecef",borderRadius:8,padding:"10px 14px",boxShadow:"0 4px 12px rgba(0,0,0,.08)"}}>
      <div style={{fontFamily:"var(--fd)",fontWeight:600,fontSize:".85rem",marginBottom:6}}>{label}</div>
      {payload.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:".8rem",padding:"2px 0"}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:p.color}}/><span style={{color:"var(--g500)"}}>{p.name}:</span><span style={{fontWeight:600}}>{p.name==="Orders"?p.value:`$${p.value?.toFixed(0)}`}</span>
      </div>)}
    </div>;
  };

  return (<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
      <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:"1.1rem"}}>Analytics Overview</span>
      <div style={{display:"flex",gap:4}}>{["7d","14d","30d"].map(r=><button key={r} className={`btn bsm ${period===r?"bp":"bs"}`} style={{padding:"4px 10px",fontSize:".7rem"}} onClick={()=>setPeriod(r)}>{r}</button>)}</div>
    </div>

    {/* KPI Cards */}
    <div className="sg" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
      {[{l:"Total Revenue",v:`$${(totalRev/1000).toFixed(1)}k`,c:"+18.2%",cl:"#2563eb",bg:"#eff6ff",i:<DollarSign size={18}/>},{l:"Total Orders",v:String(totalOrders),c:"+12.4%",cl:"#10b981",bg:"#ecfdf5",i:<ShoppingCart size={18}/>},{l:"Avg Order Value",v:`$${avgOrder}`,c:"+4.1%",cl:"#8b5cf6",bg:"#f5f3ff",i:<Target size={18}/>},{l:"Price Alerts",v:String(priceAlerts),c:priceAlerts>0?"Action needed":"All clear",cl:"#f59e0b",bg:"#fffbeb",i:<AlertTriangle size={18}/>}].map((s,i)=>(
        <div className="sc" key={i} style={{animation:`cu .5s ease ${i*.1}s forwards`,opacity:0}}><div className="sch"><span className="scl">{s.l}</span><div className="sci" style={{background:s.bg,color:s.cl}}>{s.i}</div></div><div className="scv">{s.v}</div><div className="scc" style={{color:s.cl}}>{s.c}</div></div>
      ))}
    </div>

    {/* Charts Row */}
    <div className="an-grid" style={{marginBottom:24}}>
      {/* Revenue Chart */}
      <div className="pn"><div className="pnh"><span className="pnt">Revenue & Orders</span></div>
        <div className="pnb" style={{padding:"16px 8px 8px 0"}}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.revenue.slice(period==="7d"?-7:period==="14d"?-14:-30)}>
              <defs><linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" vertical={false}/>
              <XAxis dataKey="day" tick={{fontSize:10,fill:"#868e96"}} axisLine={false} tickLine={false}/>
              <YAxis yAxisId="rev" tick={{fontSize:10,fill:"#868e96"}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
              <YAxis yAxisId="ord" orientation="right" tick={{fontSize:10,fill:"#868e96"}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2} fill="url(#gRev)" dot={false}/>
              <Line yAxisId="ord" type="monotone" dataKey="orders" name="Orders" stroke="#f59e0b" strokeWidth={2} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Marketplace Split */}
      <div className="pn"><div className="pnh"><span className="pnt">Sales by Marketplace</span></div>
        <div className="pnb" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:24,padding:"16px 24px"}}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart><Pie data={data.byMarketplace} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
              {data.byMarketplace.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Pie></PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {data.byMarketplace.map((m,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:m.color}}/><span style={{fontSize:".85rem",fontWeight:500}}>{m.name}</span><span style={{fontFamily:"var(--fd)",fontWeight:700,marginLeft:4}}>{m.value}%</span>
            </div>)}
          </div>
        </div>
      </div>
    </div>

    <div className="an-grid">
      {/* Top Products */}
      <div className="pn"><div className="pnh"><span className="pnt">Top Products</span></div>
        <div className="pnb">{data.topProducts.map((p,i)=>(
          <div className="an-row" key={i}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div className="an-rank" style={{background:i<3?["#eff6ff","#ecfdf5","#fffbeb"][i]:"var(--g100)",color:i<3?["#2563eb","#059669","#d97706"][i]:"var(--g500)"}}>{i+1}</div>
              <div><div style={{fontWeight:600,fontSize:".85rem"}}>{p.name}</div><div style={{fontSize:".75rem",color:"var(--g500)"}}>{p.units} units sold</div></div>
            </div>
            <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:".9rem"}}>${p.revenue.toLocaleString()}</span>
          </div>
        ))}</div>
      </div>

      {/* Category Split */}
      <div className="pn"><div className="pnh"><span className="pnt">Revenue by Category</span></div>
        <div className="pnb">{data.byCategory.map((c,i)=>(
          <div key={i} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:".85rem",fontWeight:500}}>{c.name}</span>
              <span style={{fontSize:".85rem",fontWeight:700,fontFamily:"var(--fd)"}}>{c.value}%</span>
            </div>
            <div style={{height:6,background:"var(--g200)",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${c.value}%`,background:c.color,borderRadius:3,transition:"width .6s ease"}}/>
            </div>
          </div>
        ))}</div>
      </div>
    </div>
  </div>);
}

// ═══ LANDING ═══
function Landing({ nav }) {
  const [sc, setSc] = useState(false); const [mob, setMob] = useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>20);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  return (<div>
    <nav className={`nav ${sc?"sc":""}`}><div className="logo"><span className="dot"/>ShelfPul</div><div className="nlinks"><a href="#features">Features</a><a href="#pricing">Pricing</a><button className="btn bg" onClick={()=>nav("login")}>Log In</button><button className="btn bp" onClick={()=>nav("signup")}>Get Started <ChevronRight size={16}/></button></div><button className="mt" onClick={()=>setMob(!mob)}>{mob?<X size={24}/>:<Menu size={24}/>}</button></nav>
    {mob&&<div style={{position:"fixed",top:64,left:0,right:0,background:"white",zIndex:999,padding:"16px 24px",borderBottom:"1px solid #e9ecef",display:"flex",flexDirection:"column",gap:12,animation:"fi .2s ease"}}><a href="#features" style={{padding:"10px 0",color:"#495057",textDecoration:"none"}} onClick={()=>setMob(false)}>Features</a><a href="#pricing" style={{padding:"10px 0",color:"#495057",textDecoration:"none"}} onClick={()=>setMob(false)}>Pricing</a><button className="btn bs" style={{width:"100%"}} onClick={()=>{setMob(false);nav("login");}}>Log In</button><button className="btn bp" style={{width:"100%"}} onClick={()=>{setMob(false);nav("signup");}}>Get Started</button></div>}
    <section className="hero"><div className="hbg"/><div className="hgr"/><div className="hin"><div className="hc"><h1 className="ai a1">Snap. List.<br/><span className="tg">Outsell.</span></h1><p className="ai a2">The all-in-one tool for marketplace sellers. Photograph products, list on Amazon & Walmart in seconds, and let smart pricing keep you ahead.</p><div className="ha ai a3"><button className="btn bp bl" onClick={()=>nav("signup")}>Start Free <ArrowRight size={18}/></button><button className="btn bs bl" onClick={()=>document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}>See How It Works</button></div><div className="hs ai a4"><div><div className="hsv">10x</div><div className="hsl">Faster Listing</div></div><div><div className="hsv">24/7</div><div className="hsl">Price Monitoring</div></div><div><div className="hsv">2</div><div className="hsl">Marketplaces</div></div></div></div>
      <div className="hv ai a3"><div className="hm"><div className="mh"><span>ShelfPul Dashboard</span><Bell size={18} color="rgba(255,255,255,.7)"/></div><div className="mb">{[{n:"Wireless Earbuds Pro",p:"$34.99",w:"78%",c:"var(--ok)",b:"Best Price",bb:"#ecfdf5",bc:"#059669"},{n:"Phone Case Ultra",p:"$12.49",w:"45%",c:"var(--warn)",b:"Price Alert",bb:"#fffbeb",bc:"#d97706"},{n:"LED Desk Lamp",p:"$28.00",w:"92%",c:"var(--p)",b:"Top Seller",bb:"#eff6ff",bc:"#2563eb"}].map((x,i)=><div className="mc" key={i}><div className="mcr"><span className="mct">{x.n}</span><span className="mcp" style={{color:x.c}}>{x.p}</span></div><div className="mbar"><div className="mbf" style={{width:x.w,background:x.c}}/></div><div style={{marginTop:8}}><span className="badge" style={{background:x.bb,color:x.bc}}>{x.b}</span></div></div>)}</div></div></div>
    </div></section>
    <section className="sec" id="features"><div className="sh"><div className="sl">Everything You Need</div><h2 className="st">Built for Sellers Who Move Fast</h2><p className="sd">From snapping a photo to watching your sales climb — every tool you need in one place.</p></div><div className="fg">{[{icon:<Camera size={24}/>,bg:"#eff6ff",c:"#2563eb",t:"Snap & List",d:"Photograph your product, and we auto-format images for Amazon and Walmart."},{icon:<TrendingUp size={24}/>,bg:"#ecfdf5",c:"#059669",t:"Smart Pricing Engine",d:"We scan competitor prices daily and tell you exactly when to adjust."},{icon:<Bell size={24}/>,bg:"#fffbeb",c:"#d97706",t:"Price Alerts",d:"Get instant notifications when competitors change prices."},{icon:<Layers size={24}/>,bg:"#f5f3ff",c:"#7c3aed",t:"Multi-Marketplace Sync",d:"Manage Amazon and Walmart from one dashboard."},{icon:<BarChart3 size={24}/>,bg:"#fef2f2",c:"#dc2626",t:"Profit Calculator",d:"See real margins after fees, shipping, and costs."},{icon:<Shield size={24}/>,bg:"#f0fdf4",c:"#16a34a",t:"Bulk Operations",d:"List 50 products at once. Batch update prices."}].map((x,i)=><div className="fc" key={i}><div className="fi" style={{background:x.bg,color:x.c}}>{x.icon}</div><h3>{x.t}</h3><p>{x.d}</p></div>)}</div></section>
    <div className="cta" id="pricing"><h2>Ready to Outsell Your Competition?</h2><p>Join sellers using ShelfPul to list faster, price smarter, and sell more.</p><button className="btn bp bl" style={{position:"relative"}} onClick={()=>nav("signup")}>Create Free Account <ArrowRight size={18}/></button></div>
    <footer className="foot"><span>© 2026 ShelfPul. All rights reserved.</span><div style={{display:"flex",gap:24}}><a href="#" style={{color:"var(--g500)",fontSize:".85rem",textDecoration:"none"}}>Privacy</a><a href="#" style={{color:"var(--g500)",fontSize:".85rem",textDecoration:"none"}}>Terms</a><a href="#" style={{color:"var(--g500)",fontSize:".85rem",textDecoration:"none"}}>Contact</a></div></footer>
  </div>);
}

// ═══ AUTH ═══
function AuthPage({ mode, nav }) {
  const {login}=useAuth(); const [il,setIl]=useState(mode==="login"); const [sp,setSp]=useState(false); const [fd,setFd]=useState({name:"",email:"",password:""}); const [err,setErr]=useState(""); const [ld,setLd]=useState(false);
  const up=(k,v)=>setFd(p=>({...p,[k]:v}));
  const sub=async()=>{
    setErr("");
    if(!fd.email||!fd.password){setErr("Please fill in all fields.");return;}
    if(!il&&!fd.name){setErr("Please enter your name.");return;}
    if(fd.password.length<6){setErr("Password must be at least 6 characters.");return;}
    setLd(true);
    try {
      if(il) {
        const {data,error}=await supabase.auth.signInWithPassword({email:fd.email,password:fd.password});
        if(error){setErr(error.message);setLd(false);return;}
        nav("dashboard");
      } else {
        const {data,error}=await supabase.auth.signUp({email:fd.email,password:fd.password,options:{data:{name:fd.name}}});
        if(error){setErr(error.message);setLd(false);return;}
        if(data.user) {
          await supabase.from("profiles").insert({id:data.user.id,name:fd.name,email:fd.email,avatar:fd.name[0].toUpperCase()});
        }
        nav("dashboard");
      }
    } catch(e){setErr("Something went wrong. Please try again.");}
    setLd(false);
  };
  const goo=async()=>{
    setLd(true);
    const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});
    if(error){setErr(error.message);setLd(false);}
  };
  return (<div className="aw">
    <div className="al"><div className="alc"><div className="logo" style={{color:"white",marginBottom:32,cursor:"pointer"}} onClick={()=>nav("landing")}><span className="dot"/> ShelfPul</div><h2>Sell smarter on every marketplace</h2><p>One platform to photograph, list, price, and monitor your products.</p><div className="afs"><div className="afi"><Camera size={18}/> Snap photos and list in seconds</div><div className="afi"><TrendingUp size={18}/> AI-powered competitive pricing</div><div className="afi"><Bell size={18}/> Daily price change alerts</div><div className="afi"><BarChart3 size={18}/> Real profit margin tracking</div></div></div></div>
    <div className="ar"><div className="afw" style={{animation:"fu .5s ease forwards"}}><div className="afh"><h1>{il?"Welcome back":"Create your account"}</h1><p>{il?"Log in to your ShelfPul account":"Start selling smarter in minutes"}</p></div>{err&&<div className="ferr">{err}</div>}<button className="btn bgo" onClick={goo} disabled={ld}><GoogleIcon/> Continue with Google</button><div className="dv">or</div><div>{!il&&<div className="ig"><label>Full Name</label><input className="inp" placeholder="John Doe" value={fd.name} onChange={e=>up("name",e.target.value)}/></div>}<div className="ig"><label>Email Address</label><input className="inp" type="email" placeholder="you@example.com" value={fd.email} onChange={e=>up("email",e.target.value)}/></div><div className="ig"><label>Password</label><div className="iw"><input className="inp" type={sp?"text":"password"} placeholder="Min. 6 characters" value={fd.password} onChange={e=>up("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&sub()}/><span className="iic" onClick={()=>setSp(!sp)}>{sp?<EyeOff size={18}/>:<Eye size={18}/>}</span></div></div><button className="btn bp" onClick={sub} disabled={ld} style={{width:"100%",justifyContent:"center",marginTop:8,padding:"14px 24px"}}>{ld?"Please wait...":il?"Log In":"Create Account"}</button></div><div className="asw">{il?"Don't have an account? ":"Already have an account? "}<a onClick={()=>{setIl(!il);setErr("");}}>{il?"Sign up":"Log in"}</a></div></div></div>
  </div>);
}

// ═══ PHASE 6A: AI DESCRIPTION WRITER ═══
function AIDescriptionWriter({ productName, category, onGenerate }) {
  const [loading, setLoading] = useState(false);
  const [marketplace, setMp] = useState("amazon");
  const [generated, setGenerated] = useState(null);

  const generate = async () => {
    if (!productName) return;
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `Write a compelling, SEO-optimized product listing for ${marketplace === "amazon" ? "Amazon" : "Walmart"} marketplace.

Product: ${productName}
Category: ${category || "General"}

Return ONLY a JSON object with these fields (no markdown, no backticks):
{"title": "optimized product title (max 200 chars, include key search terms)", "description": "compelling product description (150-200 words with bullet-point features formatted as plain text with • bullets)", "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]}` }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      try { const parsed = JSON.parse(text.replace(/```json|```/g, "").trim()); setGenerated(parsed); } catch { setGenerated({ title: productName, description: text.slice(0, 500), keywords: [] }); }
    } catch (err) {
      setGenerated({ title: `${productName} - Premium Quality ${category || "Product"} | Fast Shipping`, description: `Introducing the ${productName} — designed for quality, built for value. This ${category?.toLowerCase() || "product"} delivers exceptional performance at a competitive price.\n\n• Premium build quality with durable materials\n• Carefully inspected and tested before shipping\n• Compatible with all standard configurations\n• Compact, lightweight design for easy use\n• Backed by our satisfaction guarantee\n\nWhether you're upgrading your current setup or buying for the first time, the ${productName} is the smart choice for savvy shoppers who want reliability without breaking the bank.`, keywords: [category?.toLowerCase(), "premium", "best seller", "fast shipping", "top rated"].filter(Boolean) });
    }
    setLoading(false);
  };

  return (<div style={{ border: "1px solid var(--g200)", borderRadius: "var(--r)", padding: 16, marginBottom: 20, background: "var(--g50)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <Sparkles size={18} style={{ color: "var(--p)" }}/>
      <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".9rem" }}>AI Description Writer</span>
      <span style={{ fontSize: ".7rem", padding: "2px 8px", borderRadius: 8, background: "#eff6ff", color: "var(--p)", fontWeight: 600 }}>Powered by Claude</span>
    </div>

    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      <button className={`btn bsm ${marketplace === "amazon" ? "bp" : "bs"}`} style={{ padding: "4px 12px", fontSize: ".75rem" }} onClick={() => setMp("amazon")}>Amazon SEO</button>
      <button className={`btn bsm ${marketplace === "walmart" ? "bp" : "bs"}`} style={{ padding: "4px 12px", fontSize: ".75rem" }} onClick={() => setMp("walmart")}>Walmart SEO</button>
    </div>

    {!generated ? (
      <button className="btn bp" style={{ width: "100%", justifyContent: "center" }} onClick={generate} disabled={loading || !productName}>
        {loading ? <><Loader size={16} style={{ animation: "sp .8s linear infinite" }}/> Generating...</> : <><Sparkles size={16}/> Generate Listing Content</>}
      </button>
    ) : (
      <div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--g500)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".5px" }}>Optimized Title</div>
          <div style={{ fontSize: ".9rem", fontWeight: 600, color: "var(--g800)", padding: 10, background: "var(--w)", borderRadius: "var(--rs)", border: "1px solid var(--g200)" }}>{generated.title}</div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--g500)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".5px" }}>Description</div>
          <div style={{ fontSize: ".85rem", color: "var(--g700)", padding: 10, background: "var(--w)", borderRadius: "var(--rs)", border: "1px solid var(--g200)", whiteSpace: "pre-wrap", lineHeight: 1.6, maxHeight: 200, overflowY: "auto" }}>{generated.description}</div>
        </div>
        {generated.keywords?.length > 0 && <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--g500)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".5px" }}>Keywords</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{generated.keywords.map((k, i) => <span key={i} style={{ padding: "3px 10px", borderRadius: 12, background: "#eff6ff", color: "var(--p)", fontSize: ".75rem", fontWeight: 600 }}>{k}</span>)}</div>
        </div>}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn bp bsm" onClick={() => { onGenerate({ title: generated.title, description: generated.description }); }}><Check size={14}/> Use This Content</button>
          <button className="btn bs bsm" onClick={() => { setGenerated(null); generate(); }}><RefreshCw size={14}/> Regenerate</button>
          <button className="btn bg bsm" onClick={() => setGenerated(null)}>Cancel</button>
        </div>
      </div>
    )}
  </div>);
}

// ═══ PHASE 6A: PROFIT DASHBOARD WITH FEE CALCULATOR ═══
const AMAZON_FEES = { referral: 0.15, fbaSmall: 3.22, fbaMed: 4.75, fbaLarge: 5.40, fbaOversized: 9.73, closing: 1.80 };
const WALMART_FEES = { referral: 0.15, wfsSmall: 3.45, wfsMed: 4.95, wfsLarge: 6.10 };

function ProfitDashboard() {
  const { products } = useProducts();
  const [selectedId, setSelectedId] = useState(products[0]?.id || "");
  const [feeModel, setFeeModel] = useState("fba");
  const [shippingCost, setShippingCost] = useState("3.50");
  const [additionalCosts, setAdditionalCosts] = useState("0");

  const product = products.find(p => p.id === selectedId);
  const price = product ? parseFloat(product.price) : 0;
  const cost = product ? parseFloat(product.cost) : 0;
  const ship = parseFloat(shippingCost) || 0;
  const extra = parseFloat(additionalCosts) || 0;
  const isAmazon = product?.marketplace === "Amazon";

  const referralFee = price * (isAmazon ? AMAZON_FEES.referral : WALMART_FEES.referral);
  const fulfillmentFee = isAmazon ? (feeModel === "fba" ? AMAZON_FEES.fbaMed : 0) : (feeModel === "wfs" ? WALMART_FEES.wfsMed : 0);
  const closingFee = isAmazon ? AMAZON_FEES.closing : 0;
  const totalFees = referralFee + fulfillmentFee + closingFee;
  const totalCost = cost + ship + extra + totalFees;
  const netProfit = price - totalCost;
  const netMargin = price > 0 ? ((netProfit / price) * 100).toFixed(1) : 0;
  const roi = cost > 0 ? ((netProfit / cost) * 100).toFixed(1) : 0;

  const breakdown = [
    { label: "Sale Price", value: price, color: "var(--p)", bold: true },
    { label: "Product Cost", value: -cost, color: "var(--err)" },
    { label: `Referral Fee (${isAmazon ? "15%" : "15%"})`, value: -referralFee, color: "var(--err)" },
    { label: `Fulfillment (${isAmazon ? (feeModel === "fba" ? "FBA" : "Self") : (feeModel === "wfs" ? "WFS" : "Self")})`, value: -fulfillmentFee, color: "var(--err)" },
    ...(isAmazon ? [{ label: "Closing Fee", value: -closingFee, color: "var(--err)" }] : []),
    { label: "Shipping", value: -ship, color: "var(--err)" },
    ...(extra > 0 ? [{ label: "Additional Costs", value: -extra, color: "var(--err)" }] : []),
  ];

  const allProfits = products.map(p => {
    const pr = parseFloat(p.price) || 0;
    const co = parseFloat(p.cost) || 0;
    const ref = pr * 0.15;
    const ful = p.marketplace === "Amazon" ? AMAZON_FEES.fbaMed : WALMART_FEES.wfsMed;
    const cls = p.marketplace === "Amazon" ? AMAZON_FEES.closing : 0;
    const net = pr - co - ref - ful - cls - 3.5;
    return { ...p, netProfit: net, netMargin: pr > 0 ? (net / pr * 100) : 0 };
  });

  return (<div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Calculator size={20} style={{ color: "var(--p)" }}/><span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.1rem" }}>Profit Calculator</span></div>
    </div>

    {/* Summary Cards */}
    <div className="sg" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 }}>
      {[
        { l: "Net Profit", v: `$${netProfit.toFixed(2)}`, c: netProfit > 0 ? "Profitable" : "Loss", cl: netProfit > 0 ? "#10b981" : "#ef4444", bg: netProfit > 0 ? "#ecfdf5" : "#fef2f2", i: <DollarSign size={18}/> },
        { l: "Net Margin", v: `${netMargin}%`, c: parseFloat(netMargin) > 20 ? "Healthy" : "Low", cl: parseFloat(netMargin) > 20 ? "#10b981" : "#f59e0b", bg: parseFloat(netMargin) > 20 ? "#ecfdf5" : "#fffbeb", i: <Target size={18}/> },
        { l: "Total Fees", v: `$${totalFees.toFixed(2)}`, c: `${(totalFees / price * 100 || 0).toFixed(0)}% of sale`, cl: "#8b5cf6", bg: "#f5f3ff", i: <Calculator size={18}/> },
        { l: "ROI", v: `${roi}%`, c: "Return on cost", cl: "#2563eb", bg: "#eff6ff", i: <TrendingUp size={18}/> },
      ].map((s, i) => (
        <div className="sc" key={i} style={{ animation: `cu .5s ease ${i * .1}s forwards`, opacity: 0 }}><div className="sch"><span className="scl">{s.l}</span><div className="sci" style={{ background: s.bg, color: s.cl }}>{s.i}</div></div><div className="scv" style={{ color: s.cl }}>{s.v}</div><div className="scc" style={{ color: s.cl }}>{s.c}</div></div>
      ))}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Calculator Panel */}
      <div className="pn">
        <div className="pnh"><span className="pnt">Fee Breakdown</span></div>
        <div className="pnb">
          <div className="ig"><label>Select Product</label>
            <select className="sel" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} — ${p.price} ({p.marketplace})</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div className="ig" style={{ marginBottom: 0 }}><label>Fulfillment</label>
              <select className="sel" value={feeModel} onChange={e => setFeeModel(e.target.value)}>
                {isAmazon ? <><option value="fba">Amazon FBA ($4.75)</option><option value="self">Self-Fulfilled</option></> : <><option value="wfs">Walmart WFS ($4.95)</option><option value="self">Self-Fulfilled</option></>}
              </select>
            </div>
            <div className="ig" style={{ marginBottom: 0 }}><label>Shipping Cost</label>
              <div className="iw"><input className="inp" value={shippingCost} onChange={e => setShippingCost(e.target.value)} style={{ paddingLeft: 28 }}/><span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--g400)", fontWeight: 600 }}>$</span></div>
            </div>
          </div>

          {/* Breakdown Waterfall */}
          {breakdown.map((b, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < breakdown.length - 1 ? "1px solid var(--g100)" : "none", fontSize: ".85rem" }}>
              <span style={{ color: "var(--g600)", fontWeight: b.bold ? 700 : 400 }}>{b.label}</span>
              <span style={{ fontFamily: "var(--fd)", fontWeight: 700, color: b.color }}>{b.value >= 0 ? "" : "-"}${Math.abs(b.value).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "2px solid var(--g200)", marginTop: 8, fontSize: ".95rem" }}>
            <span style={{ fontWeight: 700 }}>Net Profit</span>
            <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.1rem", color: netProfit > 0 ? "var(--ok)" : "var(--err)" }}>${netProfit.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* All Products Profit View */}
      <div className="pn">
        <div className="pnh"><span className="pnt">All Products Profitability</span></div>
        <div className="pnb">
          {allProfits.map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < allProfits.length - 1 ? "1px solid var(--g100)" : "none", cursor: "pointer" }} onClick={() => setSelectedId(p.id)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: ".85rem", color: selectedId === p.id ? "var(--p)" : "var(--g800)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                <div style={{ fontSize: ".75rem", color: "var(--g500)" }}>{p.marketplace} · ${p.price}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".9rem", color: p.netProfit > 0 ? "var(--ok)" : "var(--err)" }}>${p.netProfit.toFixed(2)}</div>
                <div style={{ fontSize: ".7rem", color: p.netMargin > 20 ? "var(--ok)" : "var(--warn)" }}>{p.netMargin.toFixed(1)}% margin</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>);
}

// ═══ PHASE 5: COMMAND PALETTE (⌘K) ═══
function CommandPalette({ isOpen, onClose, products, onAction }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => { if (isOpen) { setQuery(""); setActiveIdx(0); setTimeout(() => inputRef.current?.focus(), 50); } }, [isOpen]);

  const actions = [
    { id: "add", icon: <Plus size={16}/>, title: "Add New Product", desc: "Create a new listing", cat: "Actions", bg: "#eff6ff", color: "#2563eb" },
    { id: "bulk", icon: <Layers size={16}/>, title: "Bulk Listing", desc: "List multiple products at once", cat: "Actions", bg: "#ecfdf5", color: "#059669" },
    { id: "pricing", icon: <DollarSign size={16}/>, title: "Price Monitor", desc: "View competitor prices", cat: "Actions", bg: "#ecfdf5", color: "#059669" },
    { id: "profit", icon: <Calculator size={16}/>, title: "Profit Calculator", desc: "Calculate fees & margins", cat: "Actions", bg: "#fffbeb", color: "#d97706" },
    { id: "inventory", icon: <Package size={16}/>, title: "Inventory Tracker", desc: "Check stock levels", cat: "Actions", bg: "#fef2f2", color: "#ef4444" },
    { id: "analytics", icon: <BarChart3 size={16}/>, title: "Analytics Dashboard", desc: "View sales & performance", cat: "Actions", bg: "#f5f3ff", color: "#8b5cf6" },
    { id: "alerts", icon: <Bell size={16}/>, title: "Alert Rules", desc: "Manage pricing rules", cat: "Actions", bg: "#fffbeb", color: "#d97706" },
    { id: "settings", icon: <Settings size={16}/>, title: "Account Settings", desc: "Manage your account", cat: "Actions", bg: "var(--g100)", color: "var(--g600)" },
  ];

  const matchedProducts = query.length > 0 ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku?.toLowerCase().includes(query.toLowerCase()) || p.marketplace.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];
  const matchedActions = query.length > 0 ? actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase())) : actions;
  const allItems = [...matchedProducts.map(p => ({ ...p, _type: "product" })), ...matchedActions.map(a => ({ ...a, _type: "action" }))];

  useEffect(() => { setActiveIdx(0); }, [query]);

  const handleKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, allItems.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && allItems[activeIdx]) { const item = allItems[activeIdx]; if (item._type === "product") onAction("detail", item.id); else onAction("navigate", item.id); onClose(); }
    else if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;
  return (<div className="cmd-modal" onClick={onClose}>
    <div className="cmd-box" onClick={e => e.stopPropagation()}>
      <div className="cmd-input-wrap"><Search size={18} style={{ color: "var(--g400)" }}/><input ref={inputRef} className="cmd-input" placeholder="Search products, actions..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKey}/><span className="cmd-kbd">ESC</span></div>
      <div className="cmd-results">
        {matchedProducts.length > 0 && <><div className="cmd-section">Products</div>{matchedProducts.map((p, i) => (
          <div key={p.id} className={`cmd-item ${activeIdx === i ? "active" : ""}`} onClick={() => { onAction("detail", p.id); onClose(); }}>
            <div className="cmd-item-icon" style={{ background: p.marketplace === "Amazon" ? "#FFF8EC" : "#EBF4FF", color: p.marketplace === "Amazon" ? "var(--am)" : "var(--wm)" }}><Package size={16}/></div>
            <div><div className="cmd-item-title">{p.name}</div><div className="cmd-item-meta">{p.marketplace} · ${p.price} · {p.sku || "No SKU"}</div></div>
          </div>
        ))}</>}
        {matchedActions.length > 0 && <><div className="cmd-section">{query ? "Actions" : "Quick Actions"}</div>{matchedActions.map((a, i) => {
          const idx = matchedProducts.length + i;
          return (<div key={a.id} className={`cmd-item ${activeIdx === idx ? "active" : ""}`} onClick={() => { onAction("navigate", a.id); onClose(); }}>
            <div className="cmd-item-icon" style={{ background: a.bg, color: a.color }}>{a.icon}</div>
            <div><div className="cmd-item-title">{a.title}</div><div className="cmd-item-meta">{a.desc}</div></div>
          </div>);
        })}</>}
        {query && allItems.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: "var(--g500)" }}><Search size={24} style={{ opacity: .3, marginBottom: 8 }}/><p style={{ fontSize: ".85rem" }}>No results for "{query}"</p></div>}
      </div>
      <div className="cmd-footer"><span><span className="cmd-kbd">↑↓</span> navigate</span><span><span className="cmd-kbd">↵</span> select</span><span><span className="cmd-kbd">esc</span> close</span></div>
    </div>
  </div>);
}

// ═══ PHASE 5: PRODUCT DETAIL PANEL ═══
function ProductDetail({ productId, products, onClose, onReprice }) {
  const product = products.find(p => p.id === productId);
  const compData = COMPETITOR_DATA[productId];
  if (!product) return null;
  const margin = product.price && product.cost ? (((parseFloat(product.price) - parseFloat(product.cost)) / parseFloat(product.price)) * 100).toFixed(1) : null;
  const profit = product.price && product.cost ? (parseFloat(product.price) - parseFloat(product.cost)).toFixed(2) : null;
  const lowest = compData ? Math.min(...compData.competitors.map(c => c.price)) : null;

  return (<>
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 199 }} onClick={onClose}/>
    <div className="detail-panel">
      <div className="detail-header">
        <div><div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.1rem" }}>{product.name}</div><div style={{ fontSize: ".8rem", color: "var(--g500)", marginTop: 2 }}>{product.marketplace} · {product.sku || "No SKU"}</div></div>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--g400)" }} onClick={onClose}><X size={20}/></button>
      </div>
      <div className="detail-body">
        {/* Status */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <span className="badge" style={{ background: product.status === "active" ? "#ecfdf5" : product.status === "price-alert" ? "#fffbeb" : "#eff6ff", color: product.status === "active" ? "#059669" : product.status === "price-alert" ? "#d97706" : "#2563eb", padding: "4px 12px", fontSize: ".8rem" }}>{product.status === "active" ? "Active" : product.status === "price-alert" ? "Price Alert" : "New"}</span>
          {compData?.buyBox && <span className="badge" style={{ background: "#ecfdf5", color: "#059669", padding: "4px 12px", fontSize: ".8rem" }}>Buy Box Winner</span>}
          <span className="badge" style={{ background: product.marketplace === "Amazon" ? "#FFF8EC" : "#EBF4FF", color: product.marketplace === "Amazon" ? "var(--am)" : "var(--wm)", padding: "4px 12px", fontSize: ".8rem" }}>{product.marketplace}</span>
        </div>

        {/* Pricing Summary */}
        <div className="detail-section">
          <div className="detail-section-title">Pricing</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div style={{ padding: 14, borderRadius: "var(--rs)", background: "var(--g50)", border: "1px solid var(--g200)", textAlign: "center" }}>
              <div style={{ fontSize: ".7rem", color: "var(--g500)", textTransform: "uppercase", letterSpacing: ".5px" }}>Your Price</div>
              <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.2rem", marginTop: 4 }}>${product.price}</div>
            </div>
            <div style={{ padding: 14, borderRadius: "var(--rs)", background: "var(--g50)", border: "1px solid var(--g200)", textAlign: "center" }}>
              <div style={{ fontSize: ".7rem", color: "var(--g500)", textTransform: "uppercase", letterSpacing: ".5px" }}>Margin</div>
              <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.2rem", marginTop: 4, color: parseFloat(margin) > 30 ? "var(--ok)" : "var(--warn)" }}>{margin ? `${margin}%` : "—"}</div>
            </div>
            <div style={{ padding: 14, borderRadius: "var(--rs)", background: "var(--g50)", border: "1px solid var(--g200)", textAlign: "center" }}>
              <div style={{ fontSize: ".7rem", color: "var(--g500)", textTransform: "uppercase", letterSpacing: ".5px" }}>Profit/Unit</div>
              <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.2rem", marginTop: 4, color: "var(--ok)" }}>{profit ? `$${profit}` : "—"}</div>
            </div>
          </div>
          {compData && <button className="btn bp" style={{ width: "100%", justifyContent: "center" }} onClick={() => { onReprice(productId); onClose(); }}><DollarSign size={16}/> Adjust Price</button>}
        </div>

        {/* Product Info */}
        <div className="detail-section">
          <div className="detail-section-title">Product Info</div>
          {[["Category", product.category], ["Condition", "New"], ["SKU", product.sku || "—"], ["Created", product.createdAt]].map(([l, v], i) => (
            <div className="detail-row" key={i}><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
          ))}
        </div>

        {/* Description */}
        {product.description && <div className="detail-section"><div className="detail-section-title">Description</div><p style={{ fontSize: ".85rem", color: "var(--g600)", lineHeight: 1.6 }}>{product.description}</p></div>}

        {/* Competition Snapshot */}
        {compData && <div className="detail-section">
          <div className="detail-section-title">Competition ({compData.competitors.length} sellers)</div>
          {[["Lowest Price", `$${lowest?.toFixed(2)}`, lowest < parseFloat(product.price) ? "var(--err)" : "var(--ok)"], ["Market Average", `$${(compData.competitors.reduce((s, c) => s + c.price, 0) / compData.competitors.length).toFixed(2)}`, "var(--g800)"], ["Your Rank", `#${compData.competitors.filter(c => c.price < parseFloat(product.price)).length + 1} of ${compData.competitors.length + 1}`, "var(--p)"]].map(([l, v, c], i) => (
            <div className="detail-row" key={i}><span className="detail-label">{l}</span><span className="detail-value" style={{ color: c }}>{v}</span></div>
          ))}
          {compData.recommendation !== "hold" && <div style={{ marginTop: 12, padding: 12, borderRadius: "var(--rs)", background: compData.recommendation === "increase" ? "#ecfdf5" : "#fef2f2", border: `1px solid ${compData.recommendation === "increase" ? "#a7f3d0" : "#fecaca"}` }}>
            <div style={{ fontSize: ".8rem", fontWeight: 600, color: compData.recommendation === "increase" ? "#059669" : "#dc2626", marginBottom: 4 }}>Recommendation: {compData.recommendation === "increase" ? "Raise" : "Lower"} Price</div>
            <div style={{ fontSize: ".8rem", color: "var(--g600)" }}>{compData.recText.split(".")[0]}.</div>
          </div>}
        </div>}

        {/* Images */}
        {product.images?.length > 0 && <div className="detail-section"><div className="detail-section-title">Photos ({product.images.length})</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>{product.images.map((img, i) => (
            <div key={i} style={{ aspectRatio: 1, borderRadius: "var(--rs)", overflow: "hidden", border: "1px solid var(--g200)" }}><img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/></div>
          ))}</div>
        </div>}
      </div>
    </div>
  </>);
}

// ═══ PHASE 5: PROFILE DROPDOWN ═══
function ProfileDropdown({ isOpen, onClose, user, onLogout, goToTab }) {
  if (!isOpen) return null;
  return (<div className="prof-drop" onClick={e => e.stopPropagation()}>
    <div className="prof-header">
      <div className="av" style={{ width: 40, height: 40, fontSize: ".95rem" }}>{user?.avatar || "U"}</div>
      <div><div className="prof-name">{user?.name}</div><div className="prof-email">{user?.email}</div></div>
    </div>
    <div style={{ padding: "4px 0" }}>
      <button className="prof-item" onClick={() => { goToTab("settings"); onClose(); }}><Settings size={16}/> Account Settings</button>
      <button className="prof-item" onClick={() => { goToTab("alerts"); onClose(); }}><Bell size={16}/> Alert Preferences</button>
      <button className="prof-item" onClick={() => { goToTab("analytics"); onClose(); }}><BarChart3 size={16}/> Analytics</button>
    </div>
    <div className="prof-divider"/>
    <div style={{ padding: "4px 0" }}>
      <button className="prof-item" onClick={onLogout} style={{ color: "var(--err)" }}><LogOut size={16}/> Log Out</button>
    </div>
  </div>);
}

// ═══ PHASE 6B: BULK LISTING MODE ═══
function BulkListingMode({ onComplete }) {
  const { addProduct } = useProducts();
  const { addToast } = useToast();
  const emptyRow = () => ({ id: Date.now() + Math.random(), name: "", cat: "Electronics", price: "", cost: "", sku: "", mp: "amazon", status: "ready" });
  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow()]);
  const [publishing, setPublishing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const updateRow = (id, field, value) => setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  const addRow = () => setRows(prev => [...prev, emptyRow()]);
  const removeRow = (id) => setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);
  const duplicateRow = (id) => { const src = rows.find(r => r.id === id); if (src) setRows(prev => [...prev, { ...src, id: Date.now() + Math.random(), name: src.name + " (copy)" }]); };

  const validRows = rows.filter(r => r.name && r.price);
  const canPublish = validRows.length > 0;

  const publishAll = () => {
    setPublishing(true); setProgress(0);
    let i = 0;
    const interval = setInterval(() => {
      if (i < validRows.length) {
        const r = validRows[i];
        addProduct({ name: r.name, category: r.cat, price: r.price, cost: r.cost, sku: r.sku, marketplace: r.mp === "amazon" ? "Amazon" : "Walmart", status: "active", images: [], description: "" });
        setRows(prev => prev.map(row => row.id === r.id ? { ...row, status: "published" } : row));
        i++; setProgress(Math.round((i / validRows.length) * 100));
      } else { clearInterval(interval); setPublishing(false); setDone(true); addToast({ type: "success", title: `${validRows.length} products listed!`, desc: "All items published to marketplace." }); }
    }, 600);
  };

  if (done) return (
    <div className="pn"><div className="pnb"><div className="ss">
      <div className="ssi"><CheckCircle size={40}/></div>
      <h3 style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.4rem", marginBottom: 8 }}>{validRows.length} Products Listed!</h3>
      <p style={{ color: "var(--g500)", marginBottom: 24 }}>All items have been published to their marketplaces.</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button className="btn bp" onClick={() => { setDone(false); setRows([emptyRow(), emptyRow(), emptyRow()]); }}><Plus size={16}/> New Batch</button>
        <button className="btn bs" onClick={() => onComplete?.()}><Package size={16}/> View Listings</button>
      </div>
    </div></div></div>
  );

  return (<div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
      <div><span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.1rem" }}>Bulk Listing</span><span style={{ fontSize: ".8rem", color: "var(--g500)", marginLeft: 8 }}>{validRows.length} of {rows.length} ready</span></div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn bs bsm" onClick={addRow}><Plus size={14}/> Add Row</button>
        <button className="btn bp bsm" onClick={publishAll} disabled={!canPublish || publishing}>{publishing ? <><Loader size={14} style={{ animation: "sp .8s linear infinite" }}/> Publishing...</> : <><Upload size={14}/> Publish All ({validRows.length})</>}</button>
      </div>
    </div>

    {publishing && <div className="bulk-progress"><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: ".8rem" }}><span style={{ color: "var(--g600)", fontWeight: 600 }}>Publishing products...</span><span style={{ color: "var(--p)", fontWeight: 700 }}>{progress}%</span></div><div className="bulk-progress-bar"><div className="bulk-progress-fill" style={{ width: `${progress}%` }}/></div></div>}

    <div className="pn"><div style={{ overflowX: "auto" }}>
      <table className="bulk-table">
        <thead><tr>
          <th style={{ width: 40 }}>#</th>
          <th style={{ minWidth: 200 }}>Product Name *</th>
          <th style={{ minWidth: 120 }}>Category</th>
          <th style={{ minWidth: 90 }}>Price *</th>
          <th style={{ minWidth: 90 }}>Cost</th>
          <th style={{ minWidth: 100 }}>SKU</th>
          <th style={{ minWidth: 110 }}>Marketplace</th>
          <th style={{ width: 60 }}>Status</th>
          <th style={{ width: 70 }}></th>
        </tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={r.id} style={{ opacity: r.status === "published" ? 0.5 : 1 }}>
            <td><div className="bulk-row-num">{i + 1}</div></td>
            <td><input className="bulk-inp" placeholder="Product name..." value={r.name} onChange={e => updateRow(r.id, "name", e.target.value)} disabled={r.status === "published"}/></td>
            <td><select className="bulk-sel" value={r.cat} onChange={e => updateRow(r.id, "cat", e.target.value)} disabled={r.status === "published"}>
              <option>Electronics</option><option>Home & Garden</option><option>Clothing</option><option>Toys & Games</option><option>Sports & Outdoors</option><option>Beauty</option><option>Automotive</option><option>Health</option><option>Office</option><option>Other</option>
            </select></td>
            <td><input className="bulk-inp" placeholder="0.00" value={r.price} onChange={e => updateRow(r.id, "price", e.target.value)} disabled={r.status === "published"} style={{ textAlign: "right" }}/></td>
            <td><input className="bulk-inp" placeholder="0.00" value={r.cost} onChange={e => updateRow(r.id, "cost", e.target.value)} disabled={r.status === "published"} style={{ textAlign: "right" }}/></td>
            <td><input className="bulk-inp" placeholder="SKU-001" value={r.sku} onChange={e => updateRow(r.id, "sku", e.target.value)} disabled={r.status === "published"}/></td>
            <td><select className="bulk-sel" value={r.mp} onChange={e => updateRow(r.id, "mp", e.target.value)} disabled={r.status === "published"}>
              <option value="amazon">Amazon</option><option value="walmart">Walmart</option>
            </select></td>
            <td style={{ textAlign: "center" }}>{r.status === "published" ? <CheckCircle size={16} style={{ color: "var(--ok)" }}/> : r.name && r.price ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ok)", margin: "0 auto" }}/> : <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--g300)", margin: "0 auto" }}/>}</td>
            <td><div style={{ display: "flex", gap: 4 }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--g400)", padding: 4 }} onClick={() => duplicateRow(r.id)} title="Duplicate"><Copy size={14}/></button>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--g400)", padding: 4 }} onClick={() => removeRow(r.id)} title="Remove"><Trash2 size={14}/></button>
            </div></td>
          </tr>
        ))}</tbody>
      </table>
    </div></div>

    <button className="btn bg" style={{ marginTop: 12, width: "100%", justifyContent: "center", borderStyle: "dashed", border: "1.5px dashed var(--g300)" }} onClick={addRow}><Plus size={16}/> Add Another Row</button>
  </div>);
}

// ═══ PHASE 6B: INVENTORY TRACKER ═══
const INVENTORY_DATA = [
  { id: "p1", name: "Wireless Bluetooth Earbuds", sku: "WBE-001", mp: "Amazon", stock: 142, maxStock: 200, reorderPoint: 30, velocity: 4.7, daysLeft: 30, lastRestock: "2026-03-01", cost: 12.00 },
  { id: "p2", name: 'LED Ring Light 10"', sku: "LRL-010", mp: "Walmart", stock: 23, maxStock: 100, reorderPoint: 20, velocity: 2.9, daysLeft: 8, lastRestock: "2026-02-20", cost: 8.50 },
  { id: "p3", name: "Phone Stand Adjustable", sku: "PSA-003", mp: "Amazon", stock: 8, maxStock: 150, reorderPoint: 25, velocity: 2.1, daysLeft: 4, lastRestock: "2026-02-15", cost: 4.25 },
  { id: "p4", name: "USB-C Hub 7-in-1", sku: "UCH-007", mp: "Amazon", stock: 87, maxStock: 150, reorderPoint: 20, velocity: 3.3, daysLeft: 26, lastRestock: "2026-03-05", cost: 11.00 },
  { id: "p5", name: "Yoga Mat Premium", sku: "YMP-001", mp: "Walmart", stock: 56, maxStock: 100, reorderPoint: 15, velocity: 2.5, daysLeft: 22, lastRestock: "2026-02-28", cost: 6.00 },
];

function InventoryTracker() {
  const [inventory, setInventory] = useState(INVENTORY_DATA);
  const [view, setView] = useState("grid");
  const [restockId, setRestockId] = useState(null);
  const [restockQty, setRestockQty] = useState("");
  const { addToast } = useToast();

  const lowStock = inventory.filter(i => i.stock <= i.reorderPoint);
  const outOfStock = inventory.filter(i => i.stock === 0);
  const totalUnits = inventory.reduce((s, i) => s + i.stock, 0);
  const totalValue = inventory.reduce((s, i) => s + (i.stock * i.cost), 0);

  const handleRestock = (id) => {
    const qty = parseInt(restockQty);
    if (!qty || qty <= 0) return;
    setInventory(prev => prev.map(i => i.id === id ? { ...i, stock: Math.min(i.stock + qty, i.maxStock), daysLeft: Math.round((i.stock + qty) / i.velocity), lastRestock: new Date().toISOString().split("T")[0] } : i));
    addToast({ type: "success", title: "Stock Updated", desc: `Added ${qty} units to ${inventory.find(i => i.id === id)?.name}.` });
    setRestockId(null); setRestockQty("");
  };

  const getStockColor = (item) => {
    if (item.stock === 0) return "var(--err)";
    if (item.stock <= item.reorderPoint) return "var(--warn)";
    return "var(--ok)";
  };

  const getStockPct = (item) => Math.min((item.stock / item.maxStock) * 100, 100);

  return (<div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
      <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.1rem" }}>Inventory Tracker</span>
      <div style={{ display: "flex", gap: 8 }}>
        <button className={`btn bsm ${view === "grid" ? "bp" : "bs"}`} onClick={() => setView("grid")}>Grid</button>
        <button className={`btn bsm ${view === "list" ? "bp" : "bs"}`} onClick={() => setView("list")}>List</button>
      </div>
    </div>

    {/* Summary */}
    <div className="sg" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 }}>
      {[
        { l: "Total Units", v: String(totalUnits), c: `${inventory.length} products`, cl: "#2563eb", bg: "#eff6ff", i: <Package size={18}/> },
        { l: "Inventory Value", v: `$${(totalValue / 1000).toFixed(1)}k`, c: "At cost basis", cl: "#8b5cf6", bg: "#f5f3ff", i: <DollarSign size={18}/> },
        { l: "Low Stock", v: String(lowStock.length), c: lowStock.length > 0 ? "Need reorder" : "All stocked", cl: "#f59e0b", bg: "#fffbeb", i: <AlertTriangle size={18}/> },
        { l: "Out of Stock", v: String(outOfStock.length), c: outOfStock.length > 0 ? "Action needed" : "None", cl: "#ef4444", bg: "#fef2f2", i: <X size={18}/> },
      ].map((s, i) => (
        <div className="sc" key={i} style={{ animation: `cu .5s ease ${i * .1}s forwards`, opacity: 0 }}><div className="sch"><span className="scl">{s.l}</span><div className="sci" style={{ background: s.bg, color: s.cl }}>{s.i}</div></div><div className="scv">{s.v}</div><div className="scc" style={{ color: s.cl }}>{s.c}</div></div>
      ))}
    </div>

    {/* Low Stock Alerts */}
    {lowStock.length > 0 && <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "var(--r)", padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
      <AlertTriangle size={20} style={{ color: "#d97706", flexShrink: 0 }}/>
      <div><div style={{ fontWeight: 700, fontSize: ".9rem", color: "#92400e" }}>{lowStock.length} product{lowStock.length > 1 ? "s" : ""} below reorder point</div>
        <div style={{ fontSize: ".8rem", color: "#a16207", marginTop: 2 }}>{lowStock.map(i => i.name).join(", ")}</div></div>
    </div>}

    {/* Restock Modal */}
    {restockId && <div className="reprice-modal" onClick={() => setRestockId(null)}>
      <div className="reprice-box" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}><h3 style={{ fontFamily: "var(--fd)", fontWeight: 700 }}>Restock</h3><button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--g400)" }} onClick={() => setRestockId(null)}><X size={20}/></button></div>
        <p style={{ fontSize: ".85rem", color: "var(--g600)", marginBottom: 16 }}>{inventory.find(i => i.id === restockId)?.name}</p>
        <div className="ig"><label>Quantity to Add</label><input className="inp" type="number" placeholder="Enter quantity" value={restockQty} onChange={e => setRestockQty(e.target.value)} autoFocus/></div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn bs" style={{ flex: 1, justifyContent: "center" }} onClick={() => setRestockId(null)}>Cancel</button>
          <button className="btn bp" style={{ flex: 1, justifyContent: "center" }} onClick={() => handleRestock(restockId)} disabled={!restockQty || parseInt(restockQty) <= 0}><Plus size={16}/> Add Stock</button>
        </div>
      </div>
    </div>}

    {/* Grid View */}
    {view === "grid" && <div className="inv-grid">
      {inventory.map(item => (
        <div key={item.id} className="inv-card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div><div style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--g800)" }}>{item.name}</div><div style={{ fontSize: ".75rem", color: "var(--g500)", marginTop: 2 }}>{item.mp} · {item.sku}</div></div>
            <span className="badge" style={{ background: item.mp === "Amazon" ? "#FFF8EC" : "#EBF4FF", color: item.mp === "Amazon" ? "var(--am)" : "var(--wm)", height: "fit-content" }}>{item.mp}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.5rem", color: getStockColor(item) }}>{item.stock}</span>
            <span style={{ fontSize: ".8rem", color: "var(--g500)" }}>/ {item.maxStock} max</span>
          </div>

          <div className="inv-bar"><div className="inv-bar-fill" style={{ width: `${getStockPct(item)}%`, background: getStockColor(item) }}/></div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12, fontSize: ".8rem" }}>
            <div><span style={{ color: "var(--g500)" }}>Velocity</span><div style={{ fontWeight: 600 }}>{item.velocity}/day</div></div>
            <div><span style={{ color: "var(--g500)" }}>Days Left</span><div style={{ fontWeight: 600, color: item.daysLeft <= 7 ? "var(--err)" : item.daysLeft <= 14 ? "var(--warn)" : "var(--g800)" }}>{item.daysLeft} days</div></div>
          </div>

          {item.stock <= item.reorderPoint && <div className="inv-alert" style={{ background: item.stock === 0 ? "#fef2f2" : "#fffbeb", color: item.stock === 0 ? "var(--err)" : "#92400e" }}>
            <AlertTriangle size={14}/> {item.stock === 0 ? "Out of stock!" : `Below reorder point (${item.reorderPoint})`}
          </div>}

          <button className="btn bs bsm" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={() => { setRestockId(item.id); setRestockQty(""); }}><Plus size={14}/> Restock</button>
        </div>
      ))}
    </div>}

    {/* List View */}
    {view === "list" && <div className="pn"><div style={{ overflowX: "auto" }}>
      <table className="bulk-table">
        <thead><tr><th>Product</th><th>SKU</th><th>Marketplace</th><th style={{ textAlign: "right" }}>Stock</th><th style={{ textAlign: "right" }}>Reorder At</th><th style={{ textAlign: "right" }}>Velocity</th><th style={{ textAlign: "right" }}>Days Left</th><th>Status</th><th></th></tr></thead>
        <tbody>{inventory.map(item => (
          <tr key={item.id}>
            <td style={{ fontWeight: 600, fontSize: ".85rem" }}>{item.name}</td>
            <td style={{ fontSize: ".8rem", color: "var(--g500)" }}>{item.sku}</td>
            <td><span className="badge" style={{ background: item.mp === "Amazon" ? "#FFF8EC" : "#EBF4FF", color: item.mp === "Amazon" ? "var(--am)" : "var(--wm)" }}>{item.mp}</span></td>
            <td style={{ textAlign: "right", fontFamily: "var(--fd)", fontWeight: 700, color: getStockColor(item) }}>{item.stock}</td>
            <td style={{ textAlign: "right", fontSize: ".85rem" }}>{item.reorderPoint}</td>
            <td style={{ textAlign: "right", fontSize: ".85rem" }}>{item.velocity}/day</td>
            <td style={{ textAlign: "right", fontWeight: 600, color: item.daysLeft <= 7 ? "var(--err)" : item.daysLeft <= 14 ? "var(--warn)" : "var(--g800)" }}>{item.daysLeft}d</td>
            <td>{item.stock <= item.reorderPoint ? <span className="badge" style={{ background: "#fef2f2", color: "var(--err)" }}>Low</span> : <span className="badge" style={{ background: "#ecfdf5", color: "var(--ok)" }}>OK</span>}</td>
            <td><button className="btn bp bsm" style={{ padding: "3px 10px", fontSize: ".7rem" }} onClick={() => { setRestockId(item.id); setRestockQty(""); }}>Restock</button></td>
          </tr>
        ))}</tbody>
      </table>
    </div></div>}
  </div>);
}

// ═══ PHASE 6C: CSV IMPORT ═══
function CSVImport({ onComplete }) {
  const { addProduct } = useProducts();
  const { addToast } = useToast();
  const fileRef = useRef(null);
  const [csvData, setCsvData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [step, setStep] = useState(1); // 1=upload, 2=map, 3=preview, 4=done
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(0);

  const requiredFields = ["name","price"];
  const spFields = [{key:"name",label:"Product Name *"},{key:"category",label:"Category"},{key:"price",label:"Price *"},{key:"cost",label:"Cost"},{key:"sku",label:"SKU"},{key:"marketplace",label:"Marketplace"},{key:"description",label:"Description"},{key:"upc",label:"UPC/Barcode"},{key:"brand",label:"Brand"},{key:"",label:"— Skip —"}];

  const parseCSV = (text) => {
    const lines = text.trim().split("\n").map(l => {
      const result = []; let cur = ""; let inQ = false;
      for (let c of l) { if (c === '"') inQ = !inQ; else if (c === "," && !inQ) { result.push(cur.trim()); cur = ""; } else cur += c; }
      result.push(cur.trim()); return result;
    });
    if (lines.length < 2) return;
    const h = lines[0]; const r = lines.slice(1).filter(l => l.some(c => c));
    setHeaders(h); setRows(r);
    // Auto-map by header name matching
    const autoMap = {};
    h.forEach((col, i) => {
      const cl = col.toLowerCase().replace(/[^a-z]/g, "");
      if (cl.includes("name") || cl.includes("title") || cl.includes("product")) autoMap[i] = "name";
      else if (cl.includes("price") && !cl.includes("cost")) autoMap[i] = "price";
      else if (cl.includes("cost")) autoMap[i] = "cost";
      else if (cl.includes("sku") || cl.includes("asin")) autoMap[i] = "sku";
      else if (cl.includes("category") || cl.includes("type")) autoMap[i] = "category";
      else if (cl.includes("market") || cl.includes("channel")) autoMap[i] = "marketplace";
      else if (cl.includes("desc")) autoMap[i] = "description";
      else if (cl.includes("upc") || cl.includes("ean") || cl.includes("barcode")) autoMap[i] = "upc";
      else if (cl.includes("brand")) autoMap[i] = "brand";
    });
    setMapping(autoMap); setStep(2);
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { setCsvData(e.target.result); parseCSV(e.target.result); };
    reader.readAsText(file);
  };

  const mappedRows = rows.map(row => {
    const obj = {};
    Object.entries(mapping).forEach(([colIdx, field]) => { if (field) obj[field] = row[parseInt(colIdx)] || ""; });
    return obj;
  }).filter(r => r.name && r.price);

  const doImport = () => {
    setImporting(true); setImported(0); setStep(4);
    let i = 0;
    const interval = setInterval(() => {
      if (i < mappedRows.length) {
        const r = mappedRows[i];
        addProduct({ name: r.name, category: r.category || "Other", price: r.price.replace(/[$,]/g, ""), cost: (r.cost || "0").replace(/[$,]/g, ""), sku: r.sku || "", marketplace: (r.marketplace || "").toLowerCase().includes("walmart") ? "Walmart" : "Amazon", status: "active", images: [], description: r.description || "" });
        i++; setImported(i);
      } else { clearInterval(interval); setImporting(false); addToast({ type: "success", title: `${mappedRows.length} products imported!`, desc: "All items added to your listings." }); }
    }, 300);
  };

  return (<div style={{ maxWidth: 800, margin: "0 auto" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
      <FileText size={20} style={{ color: "var(--p)" }}/>
      <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.1rem" }}>CSV Import</span>
      <span style={{ fontSize: ".8rem", color: "var(--g500)" }}>Step {step} of 4</span>
    </div>

    {/* Step 1: Upload */}
    {step === 1 && <div className="pn"><div className="pnh"><span className="pnt">Upload CSV File</span></div><div className="pnb">
      <div className="csv-drop" onClick={() => fileRef.current?.click()} onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("drag"); }} onDragLeave={e => e.currentTarget.classList.remove("drag")} onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("drag"); handleFile(e.dataTransfer.files[0]); }}>
        <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" onChange={e => handleFile(e.target.files[0])}/>
        <Upload size={40} style={{ color: "var(--g400)", marginBottom: 12 }}/>
        <div style={{ fontWeight: 600, color: "var(--g700)", marginBottom: 4 }}>Drop your CSV file here or tap to browse</div>
        <div style={{ fontSize: ".85rem", color: "var(--g500)" }}>Supports .csv, .tsv files — first row should be column headers</div>
      </div>
      <div style={{ marginTop: 20, padding: 16, background: "var(--g50)", borderRadius: "var(--r)", border: "1px solid var(--g200)" }}>
        <div style={{ fontWeight: 600, fontSize: ".85rem", marginBottom: 8, color: "var(--g700)" }}>Expected CSV Format</div>
        <div style={{ fontFamily: "monospace", fontSize: ".8rem", color: "var(--g500)", lineHeight: 1.6 }}>Product Name, Category, Price, Cost, SKU, Marketplace<br/>Wireless Earbuds, Electronics, 34.99, 12.00, WBE-001, Amazon<br/>LED Ring Light, Photography, 22.50, 8.50, LRL-010, Walmart</div>
      </div>
    </div></div>}

    {/* Step 2: Map Columns */}
    {step === 2 && <div className="pn"><div className="pnh"><span className="pnt">Map Columns</span><span style={{ fontSize: ".8rem", color: "var(--g500)" }}>{headers.length} columns found, {rows.length} rows</span></div><div className="pnb">
      <p style={{ fontSize: ".85rem", color: "var(--g500)", marginBottom: 16 }}>Match your CSV columns to ShelfPul fields. We auto-detected some — adjust if needed.</p>
      {headers.map((h, i) => (
        <div className="csv-mapping" key={i}>
          <div style={{ fontWeight: 600, fontSize: ".85rem", padding: "8px 12px", background: "var(--g50)", borderRadius: "var(--rs)" }}>{h}</div>
          <ArrowRight size={16} style={{ color: "var(--g400)" }}/>
          <select className="sel" style={{ padding: "8px 12px", fontSize: ".85rem" }} value={mapping[i] || ""} onChange={e => setMapping(prev => ({ ...prev, [i]: e.target.value }))}>{spFields.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}</select>
        </div>
      ))}
      {!Object.values(mapping).includes("name") && <div style={{ marginTop: 12, padding: 10, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--rs)", fontSize: ".85rem", color: "var(--err)" }}>Please map at least "Product Name" and "Price" fields.</div>}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button className="btn bs" onClick={() => { setStep(1); setCsvData(null); }}>Back</button>
        <button className="btn bp" disabled={!Object.values(mapping).includes("name") || !Object.values(mapping).includes("price")} onClick={() => setStep(3)}>Preview Import <ChevronRight size={16}/></button>
      </div>
    </div></div>}

    {/* Step 3: Preview */}
    {step === 3 && <div className="pn"><div className="pnh"><span className="pnt">Preview ({mappedRows.length} valid rows)</span></div><div className="pnb">
      <div className="csv-preview"><table><thead><tr><th>#</th>{Object.values(mapping).filter(Boolean).map((f, i) => <th key={i}>{spFields.find(s => s.key === f)?.label || f}</th>)}</tr></thead>
        <tbody>{mappedRows.slice(0, 20).map((r, i) => <tr key={i}><td>{i + 1}</td>{Object.values(mapping).filter(Boolean).map((f, j) => <td key={j}>{r[f] || "—"}</td>)}</tr>)}</tbody>
      </table></div>
      {mappedRows.length > 20 && <div style={{ textAlign: "center", padding: 8, fontSize: ".8rem", color: "var(--g500)" }}>Showing 20 of {mappedRows.length} rows</div>}
      {rows.length - mappedRows.length > 0 && <div style={{ marginTop: 8, fontSize: ".8rem", color: "var(--warn)" }}>{rows.length - mappedRows.length} rows skipped (missing required fields)</div>}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button className="btn bs" onClick={() => setStep(2)}>Back</button>
        <button className="btn bp" onClick={doImport}><Upload size={16}/> Import {mappedRows.length} Products</button>
      </div>
    </div></div>}

    {/* Step 4: Importing / Done */}
    {step === 4 && <div className="pn"><div className="pnb">
      {importing ? <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ width: 48, height: 48, border: "3px solid var(--g200)", borderTopColor: "var(--p)", borderRadius: "50%", animation: "sp .8s linear infinite", margin: "0 auto 16px" }}/>
        <h3 style={{ fontFamily: "var(--fd)", fontWeight: 700, marginBottom: 8 }}>Importing Products...</h3>
        <p style={{ color: "var(--g500)", marginBottom: 16 }}>{imported} of {mappedRows.length} imported</p>
        <div className="bulk-progress-bar" style={{ maxWidth: 300, margin: "0 auto" }}><div className="bulk-progress-fill" style={{ width: `${(imported / mappedRows.length) * 100}%` }}/></div>
      </div> : <div className="ss">
        <div className="ssi"><CheckCircle size={40}/></div>
        <h3 style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.4rem", marginBottom: 8 }}>{mappedRows.length} Products Imported!</h3>
        <p style={{ color: "var(--g500)", marginBottom: 24 }}>All items have been added to your listings.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn bp" onClick={() => { setStep(1); setCsvData(null); setHeaders([]); setRows([]); setMapping({}); }}><FileText size={16}/> Import Another</button>
          <button className="btn bs" onClick={() => onComplete?.()}><Package size={16}/> View Listings</button>
        </div>
      </div>}
    </div></div>}
  </div>);
}

// ═══ PHASE 6C: BARCODE SCANNER ═══
function BarcodeScanner() {
  const { addProduct } = useProducts();
  const { addToast } = useToast();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [manualCode, setManualCode] = useState("");

  const MOCK_PRODUCTS = {
    "012345678901": { name: "Wireless Charging Pad", category: "Electronics", price: "24.99", cost: "8.00", brand: "TechPower", upc: "012345678901" },
    "098765432109": { name: "Stainless Steel Water Bottle 32oz", category: "Home & Garden", price: "18.99", cost: "5.50", brand: "HydroLife", upc: "098765432109" },
    "567890123456": { name: "Organic Green Tea 100 Bags", category: "Health", price: "12.49", cost: "4.00", brand: "PureTea", upc: "567890123456" },
  };

  const startScan = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } });
      setStream(s); if (videoRef.current) videoRef.current.srcObject = s; setScanning(true); setError(null); setResult(null);
      // Simulate barcode detection after a few seconds
      setTimeout(() => {
        const codes = Object.keys(MOCK_PRODUCTS);
        const code = codes[Math.floor(Math.random() * codes.length)];
        setResult({ code, product: MOCK_PRODUCTS[code] }); setScanning(false);
        if (s) s.getTracks().forEach(t => t.stop());
      }, 3000);
    } catch { setError("Camera access denied. You can enter the barcode manually below."); }
  };

  const stopScan = () => { if (stream) stream.getTracks().forEach(t => t.stop()); setScanning(false); };

  const lookupManual = () => {
    const product = MOCK_PRODUCTS[manualCode];
    if (product) { setResult({ code: manualCode, product }); }
    else { setResult({ code: manualCode, product: null }); }
  };

  const addFromScan = () => {
    if (!result?.product) return;
    addProduct({ name: result.product.name, category: result.product.category, price: result.product.price, cost: result.product.cost, sku: result.code, marketplace: "Amazon", status: "new", images: [], description: `${result.product.brand} — UPC: ${result.product.upc}` });
    addToast({ type: "success", title: "Product Added!", desc: `${result.product.name} added from barcode scan.` });
    setResult(null); setManualCode("");
  };

  return (<div style={{ maxWidth: 600, margin: "0 auto" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
      <ScanLine size={20} style={{ color: "var(--p)" }}/>
      <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.1rem" }}>Barcode Scanner</span>
    </div>

    <div className="pn"><div className="pnh"><span className="pnt">Scan Product Barcode</span></div><div className="pnb">
      {/* Camera Scanner */}
      {scanning ? (
        <div><div className="scan-area"><video ref={videoRef} autoPlay playsInline muted/><div className="scan-overlay"><div className="scan-box"><div className="scan-line"/></div></div></div>
          <p style={{ textAlign: "center", fontSize: ".85rem", color: "var(--g500)", marginTop: 12 }}>Point camera at barcode...</p>
          <button className="btn bs" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={stopScan}><X size={16}/> Cancel Scan</button>
        </div>
      ) : result ? (
        <div className="scan-result" style={{ background: result.product ? "#ecfdf5" : "#fef2f2", border: `1.5px solid ${result.product ? "#a7f3d0" : "#fecaca"}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            {result.product ? <CheckCircle size={20} style={{ color: "var(--ok)" }}/> : <AlertTriangle size={20} style={{ color: "var(--err)" }}/>}
            <span style={{ fontWeight: 700, fontSize: ".95rem", color: result.product ? "#059669" : "#dc2626" }}>{result.product ? "Product Found!" : "Product Not Found"}</span>
          </div>
          <div style={{ fontSize: ".8rem", color: "var(--g500)", marginBottom: 12 }}>Barcode: {result.code}</div>
          {result.product ? (<>
            <div style={{ display: "grid", gap: 8 }}>
              {[["Product", result.product.name], ["Brand", result.product.brand], ["Category", result.product.category], ["Suggested Price", `$${result.product.price}`], ["Est. Cost", `$${result.product.cost}`]].map(([l, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem" }}><span style={{ color: "var(--g500)" }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span></div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn bp" style={{ flex: 1, justifyContent: "center" }} onClick={addFromScan}><Plus size={16}/> Add to Listings</button>
              <button className="btn bs" onClick={() => { setResult(null); startScan(); }}><RefreshCw size={16}/> Scan Another</button>
            </div>
          </>) : (<>
            <p style={{ fontSize: ".85rem", color: "var(--g600)", marginBottom: 12 }}>This barcode isn't in our database yet. You can add it manually.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn bp bsm" onClick={() => setResult(null)}><Plus size={14}/> Add Manually</button>
              <button className="btn bs bsm" onClick={() => { setResult(null); startScan(); }}><RefreshCw size={14}/> Scan Again</button>
            </div>
          </>)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          {error && <div style={{ marginBottom: 16, padding: 12, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--rs)", fontSize: ".85rem", color: "var(--err)" }}>{error}</div>}
          <button className="btn bp bl" style={{ margin: "0 auto" }} onClick={startScan}><Camera size={20}/> Start Scanning</button>
          <p style={{ fontSize: ".8rem", color: "var(--g500)", marginTop: 12 }}>Point your camera at any UPC, EAN, or ISBN barcode</p>
        </div>
      )}

      {/* Manual Entry */}
      {!scanning && <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--g200)" }}>
        <div style={{ fontSize: ".85rem", fontWeight: 600, color: "var(--g700)", marginBottom: 8 }}>Or enter barcode manually</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="inp" placeholder="Enter UPC, EAN, or ISBN..." value={manualCode} onChange={e => setManualCode(e.target.value)} onKeyDown={e => e.key === "Enter" && lookupManual()} style={{ flex: 1 }}/>
          <button className="btn bp" onClick={lookupManual} disabled={!manualCode}><Search size={16}/> Lookup</button>
        </div>
        <div style={{ marginTop: 12, fontSize: ".75rem", color: "var(--g400)" }}>
          Try these demo barcodes: 012345678901 · 098765432109 · 567890123456
        </div>
      </div>}
    </div></div>
  </div>);
}

// ═══ PHASE 6C: MULTI-USER TEAM MODE ═══
const TEAM_MEMBERS = [
  { id: "u1", name: "You (Owner)", email: "owner@shelfpul.com", role: "owner", avatar: "O", status: "active", lastActive: "Now", color: "#2563eb" },
  { id: "u2", name: "Maria Rodriguez", email: "maria@shelfpul.com", role: "admin", avatar: "M", status: "active", lastActive: "5 min ago", color: "#8b5cf6" },
  { id: "u3", name: "James Chen", email: "james@shelfpul.com", role: "editor", avatar: "J", status: "active", lastActive: "1 hr ago", color: "#059669" },
  { id: "u4", name: "Sarah Kim", email: "sarah@shelfpul.com", role: "viewer", avatar: "S", status: "invited", lastActive: "Pending", color: "#d97706" },
];

const ROLE_CONFIG = {
  owner: { label: "Owner", color: "#2563eb", bg: "#eff6ff", perms: "Full access. Manage team, billing, and all settings." },
  admin: { label: "Admin", color: "#8b5cf6", bg: "#f5f3ff", perms: "Manage products, pricing, and team members." },
  editor: { label: "Editor", color: "#059669", bg: "#ecfdf5", perms: "Create and edit listings. Adjust prices." },
  viewer: { label: "Viewer", color: "#d97706", bg: "#fffbeb", perms: "View-only access to listings and analytics." },
};

function TeamManagement() {
  const { addToast } = useToast();
  const [members, setMembers] = useState(TEAM_MEMBERS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");

  const sendInvite = () => {
    if (!inviteEmail) return;
    const newMember = { id: "u" + Date.now(), name: inviteEmail.split("@")[0], email: inviteEmail, role: inviteRole, avatar: inviteEmail[0].toUpperCase(), status: "invited", lastActive: "Pending", color: ["#2563eb", "#8b5cf6", "#059669", "#d97706", "#ef4444"][Math.floor(Math.random() * 5)] };
    setMembers(prev => [...prev, newMember]);
    addToast({ type: "success", title: "Invitation Sent", desc: `Invite sent to ${inviteEmail} as ${ROLE_CONFIG[inviteRole].label}.` });
    setInviteEmail(""); setShowInvite(false);
  };

  const changeRole = (id, role) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
    addToast({ type: "success", title: "Role Updated", desc: `${members.find(m => m.id === id)?.name} is now ${ROLE_CONFIG[role].label}.` });
  };

  const removeMember = (id) => {
    const m = members.find(m => m.id === id);
    setMembers(prev => prev.filter(m => m.id !== id));
    addToast({ type: "info", title: "Member Removed", desc: `${m?.name} has been removed from the team.` });
  };

  return (<div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Users size={20} style={{ color: "var(--p)" }}/><span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.1rem" }}>Team Management</span><span style={{ fontSize: ".8rem", color: "var(--g500)" }}>{members.length} member{members.length !== 1 ? "s" : ""}</span></div>
      <button className="btn bp bsm" onClick={() => setShowInvite(true)}><UserPlus size={14}/> Invite Member</button>
    </div>

    {/* Invite Modal */}
    {showInvite && <div className="reprice-modal invite-modal" onClick={() => setShowInvite(false)}>
      <div className="invite-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}><h3 style={{ fontFamily: "var(--fd)", fontWeight: 700 }}>Invite Team Member</h3><button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--g400)" }} onClick={() => setShowInvite(false)}><X size={20}/></button></div>
        <div className="ig"><label>Email Address</label><input className="inp" type="email" placeholder="colleague@company.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} autoFocus/></div>
        <div className="ig"><label>Role</label><select className="sel" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
          <option value="admin">Admin — Manage products, pricing, team</option>
          <option value="editor">Editor — Create and edit listings</option>
          <option value="viewer">Viewer — View-only access</option>
        </select></div>
        <div style={{ background: "var(--g50)", borderRadius: "var(--rs)", padding: 12, marginBottom: 20, fontSize: ".8rem", color: "var(--g600)" }}>
          <span style={{ fontWeight: 600 }}>{ROLE_CONFIG[inviteRole].label}:</span> {ROLE_CONFIG[inviteRole].perms}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn bs" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowInvite(false)}>Cancel</button>
          <button className="btn bp" style={{ flex: 1, justifyContent: "center" }} onClick={sendInvite} disabled={!inviteEmail}><UserPlus size={16}/> Send Invite</button>
        </div>
      </div>
    </div>}

    {/* Role Legend */}
    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
      {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: cfg.bg, fontSize: ".75rem", fontWeight: 600, color: cfg.color }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }}/>{cfg.label}</div>
      ))}
    </div>

    {/* Team Cards */}
    <div className="team-grid">
      {members.map(m => {
        const rc = ROLE_CONFIG[m.role];
        return (
          <div key={m.id} className="team-card">
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div className="team-avatar" style={{ background: m.color + "18", color: m.color }}>{m.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--g800)", display: "flex", alignItems: "center", gap: 6 }}>{m.name}{m.status === "invited" && <span className="badge" style={{ background: "#fffbeb", color: "#d97706", fontSize: ".6rem" }}>Pending</span>}</div>
                <div style={{ fontSize: ".8rem", color: "var(--g500)", marginTop: 1 }}>{m.email}</div>
              </div>
              <span className="team-role" style={{ background: rc.bg, color: rc.color }}>{rc.label}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--g100)" }}>
              <span style={{ fontSize: ".75rem", color: "var(--g400)" }}>Last active: {m.lastActive}</span>
              {m.role !== "owner" && <div style={{ display: "flex", gap: 6 }}>
                <select className="sel" value={m.role} onChange={e => changeRole(m.id, e.target.value)} style={{ padding: "4px 28px 4px 8px", fontSize: ".75rem", width: "auto" }}>
                  <option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option>
                </select>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--g400)", padding: 4 }} onClick={() => removeMember(m.id)} title="Remove"><Trash2 size={14}/></button>
              </div>}
            </div>
          </div>
        );
      })}
    </div>
  </div>);
}

// ═══ PHASE 6A: DARK MODE TOGGLE ═══
function DarkModeToggle() {
  const { dark, toggle } = useTheme();
  return (<button className="sbk" onClick={toggle} style={{ justifyContent: "space-between" }}>
    <span style={{ display: "flex", alignItems: "center", gap: 12 }}>{dark ? <Moon size={20}/> : <Sun size={20}/>} {dark ? "Dark Mode" : "Light Mode"}</span>
    <button className={`rule-toggle ${dark ? "on" : "off"}`} onClick={e => { e.stopPropagation(); toggle(); }} style={{ width: 36, height: 20 }}>
      <span style={{ position: "absolute" }}/>
    </button>
  </button>);
}

// ═══ PHASE 5: ONBOARDING ═══
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: <Camera size={40}/>, iconBg: "#eff6ff", iconColor: "#2563eb", title: "Welcome to ShelfPul", desc: "The fastest way to list products on Amazon and Walmart. Let's get you set up in 30 seconds." },
    { icon: <Upload size={40}/>, iconBg: "#ecfdf5", iconColor: "#059669", title: "Snap & List", desc: "Take a photo of your product or upload from your gallery. We'll format it to meet marketplace requirements automatically." },
    { icon: <DollarSign size={40}/>, iconBg: "#fffbeb", iconColor: "#d97706", title: "Smart Pricing", desc: "We monitor competitor prices 24/7 and alert you when it's time to adjust. Never miss a pricing opportunity." },
    { icon: <TrendingUp size={40}/>, iconBg: "#f5f3ff", iconColor: "#8b5cf6", title: "You're Ready!", desc: "Start listing your products and let ShelfPul handle the pricing intelligence. Your first listing takes under 60 seconds." },
  ];
  const s = steps[step];
  return (<div className="onboard-overlay"><div className="onboard-box">
    <div style={{ width: 80, height: 80, borderRadius: "50%", background: s.iconBg, color: s.iconColor, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>{s.icon}</div>
    <h2 style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.5rem", color: "var(--b)", marginBottom: 8 }}>{s.title}</h2>
    <p style={{ color: "var(--g500)", lineHeight: 1.6, maxWidth: 360, margin: "0 auto", fontSize: ".95rem" }}>{s.desc}</p>
    <div className="onboard-steps">{steps.map((_, i) => <div key={i} className={`onboard-dot ${i === step ? "act" : i < step ? "done" : "pending"}`}/>)}</div>
    <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
      {step > 0 && <button className="btn bs" onClick={() => setStep(step - 1)}>Back</button>}
      {step < steps.length - 1 ? <button className="btn bp" onClick={() => setStep(step + 1)}>Next <ChevronRight size={16}/></button>
        : <button className="btn bp bl" onClick={onComplete}>Start Selling <ArrowRight size={18}/></button>}
    </div>
    {step < steps.length - 1 && <button style={{ background: "none", border: "none", color: "var(--g400)", cursor: "pointer", marginTop: 16, fontSize: ".85rem" }} onClick={onComplete}>Skip tour</button>}
  </div></div>);
}

// ═══ DASHBOARD ═══
function Dash({ nav }) {
  const {user,logout}=useAuth(); const {products}=useProducts(); const {addToast}=useToast();
  const [tab,setTab]=useState("overview"); const [sb,setSb]=useState(false); const [flt,setFlt]=useState("all");
  const [notifOpen,setNotifOpen]=useState(false); const [repriceProduct,setRepriceProduct]=useState(null);
  const [cmdOpen,setCmdOpen]=useState(false); const [profOpen,setProfOpen]=useState(false);
  const [detailProduct,setDetailProduct]=useState(null); const [showOnboard,setShowOnboard]=useState(()=>!window.__sp_onboarded);
  const nvs=[{id:"overview",l:"Overview",i:<Home size={20}/>},{id:"listings",l:"My Listings",i:<Package size={20}/>},{id:"upload",l:"Add Product",i:<Upload size={20}/>},{id:"bulk",l:"Bulk Listing",i:<Layers size={20}/>},{id:"csv",l:"CSV Import",i:<FileText size={20}/>},{id:"scanner",l:"Barcode Scanner",i:<ScanLine size={20}/>},{id:"pricing",l:"Price Monitor",i:<DollarSign size={20}/>},{id:"profit",l:"Profit Calculator",i:<Calculator size={20}/>},{id:"inventory",l:"Inventory",i:<Package size={20}/>},{id:"alerts",l:"Alert Rules",i:<Bell size={20}/>},{id:"analytics",l:"Analytics",i:<BarChart3 size={20}/>},{id:"team",l:"Team",i:<Users size={20}/>}];

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(()=>{const h=(e)=>{if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setCmdOpen(true);}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);

  const handleCmdAction=(type,id)=>{if(type==="navigate"){setTab(id==="add"?"upload":id);setCmdOpen(false);}else if(type==="detail"){setDetailProduct(id);setCmdOpen(false);}};
  const handleLogout=()=>{logout();nav("landing");};
  const closeAll=()=>{setNotifOpen(false);setProfOpen(false);};
  const als=[{t:"Phone Stand — competitor dropped to $13.99",ty:"warning",tm:"12 min ago",pid:"p3"},{t:"Wireless Earbuds — you have the best price",ty:"success",tm:"1 hr ago",pid:"p1"},{t:"LED Ring Light — new competitor on Walmart",ty:"info",tm:"3 hrs ago",pid:"p2"},{t:"USB-C Hub — 2 competitors raised price, increase opportunity",ty:"opportunity",tm:"5 hrs ago",pid:"p4"}];
  const alc={warning:"#f59e0b",success:"#10b981",info:"#3b82f6",opportunity:"#8b5cf6"};
  const tts={overview:"Dashboard",listings:"My Listings",upload:"Add Product",bulk:"Bulk Listing",csv:"CSV Import",scanner:"Barcode Scanner",pricing:"Price Monitor",profit:"Profit Calculator",inventory:"Inventory",alerts:"Alert Rules",analytics:"Analytics",team:"Team",settings:"Settings"};
  const fp=flt==="all"?products:flt==="amazon"?products.filter(p=>p.marketplace==="Amazon"):flt==="walmart"?products.filter(p=>p.marketplace==="Walmart"):products.filter(p=>p.status===flt);

  return (<div className="db">
    <div className={`mo ${sb?"act":""}`} onClick={()=>setSb(false)}/>
    <aside className={`sb ${sb?"mop":""}`}><div className="sbh"><div className="logo" style={{fontSize:"1.3rem"}}><span className="dot"/> ShelfPul</div><button className="mt" onClick={()=>setSb(false)} style={{display:sb?"block":undefined}}><X size={20}/></button></div><nav className="sbn"><div className="sbl">Main</div>{nvs.map(n=><button key={n.id} className={`sbk ${tab===n.id?"act":""}`} onClick={()=>{setTab(n.id);setSb(false);}}>{n.i} {n.l}</button>)}<div className="sbl" style={{marginTop:16}}>Account</div><button className="sbk" onClick={()=>{setTab("settings");setSb(false);}}><Settings size={20}/> Settings</button></nav><div className="sbf"><DarkModeToggle/><button className="sbk" onClick={()=>{logout();nav("landing");}} style={{color:"var(--err)"}}><LogOut size={20}/> Log Out</button></div></aside>

    <main className="mn"><div className="tb"><div className="tbl"><button className="mt" onClick={()=>setSb(true)}><Menu size={22}/></button><h1 className="tbt">{tts[tab]||"Dashboard"}</h1></div><div className="tbr"><div className="srch" onClick={()=>setCmdOpen(true)} style={{cursor:"pointer"}}><Search size={18}/><span style={{color:"var(--g400)",fontSize:".9rem",flex:1}}>Search products...</span><span className="cmd-kbd" style={{fontSize:".7rem"}}>⌘K</span></div><div style={{position:"relative"}}><button className="nb" onClick={()=>{setNotifOpen(!notifOpen);setProfOpen(false);}}><Bell size={18}/><span className="nd"/></button><NotificationCenter isOpen={notifOpen} onClose={()=>setNotifOpen(false)} onAction={(type,pid)=>{if(type==="reprice"){setRepriceProduct(pid);setNotifOpen(false);}}} goToTab={(t)=>setTab(t)}/></div><div style={{position:"relative"}}><div className="av" onClick={()=>{setProfOpen(!profOpen);setNotifOpen(false);}}>{user?.avatar||"U"}</div><ProfileDropdown isOpen={profOpen} onClose={()=>setProfOpen(false)} user={user} onLogout={handleLogout} goToTab={setTab}/></div></div></div>
      {cmdOpen && <CommandPalette isOpen={cmdOpen} onClose={()=>setCmdOpen(false)} products={products} onAction={handleCmdAction}/>}
      {repriceProduct && <RepriceModal productId={repriceProduct} onClose={()=>setRepriceProduct(null)}/>}
      {detailProduct && <ProductDetail productId={detailProduct} products={products} onClose={()=>setDetailProduct(null)} onReprice={(id)=>{setRepriceProduct(id);setDetailProduct(null);}}/>}
      {showOnboard && <Onboarding onComplete={()=>{setShowOnboard(false);window.__sp_onboarded=true;addToast({type:"success",title:"Welcome to ShelfPul!",desc:"Start by adding your first product."});}}/>}
      <div className="pc" onClick={closeAll}>
        {tab==="overview"&&<><div className="sg">{[{l:"Active Listings",v:String(products.filter(p=>p.status==="active").length),c:products.length+" total",cl:"#2563eb",bg:"#eff6ff",i:<Package size={18}/>},{l:"Price Alerts",v:String(products.filter(p=>p.status==="price-alert").length),c:"need action",cl:"#f59e0b",bg:"#fffbeb",i:<Bell size={18}/>},{l:"Avg. Margin",v:"32%",c:"+2.4%",cl:"#10b981",bg:"#ecfdf5",i:<TrendingUp size={18}/>},{l:"Revenue (30d)",v:"$12,847",c:"+18%",cl:"#8b5cf6",bg:"#f5f3ff",i:<DollarSign size={18}/>}].map((s,i)=><div className="sc" key={i} style={{animation:`cu .5s ease ${i*.1}s forwards`,opacity:0}}><div className="sch"><span className="scl">{s.l}</span><div className="sci" style={{background:s.bg,color:s.cl}}>{s.i}</div></div><div className="scv">{s.v}</div><div className="scc" style={{color:s.cl}}>{s.c}</div></div>)}</div>
          <div className="dg"><div className="pn"><div className="pnh"><span className="pnt">Recent Listings</span><button className="btn bg" style={{padding:"6px 12px",fontSize:".8rem"}} onClick={()=>setTab("listings")}>View All</button></div><div className="pnb">{products.slice(0,5).map((p,i)=><div className="li" key={i} style={{cursor:"pointer"}} onClick={()=>setDetailProduct(p.id)}><div className="lt">{p.images?.[0]?<img src={p.images[0]} alt=""/>:<Package size={20}/>}</div><div className="linf"><div className="ln">{p.name}</div><div className="lm">{p.marketplace}</div></div><div className="lp">${p.price}</div></div>)}</div></div>
            <div className="pn"><div className="pnh"><span className="pnt">Price Alerts</span><button className="btn bg bsm" style={{padding:"4px 10px",fontSize:".7rem"}} onClick={()=>setTab("alerts")}>Manage Rules</button></div><div className="pnb">{als.map((a,i)=><div className="ali" key={i}><div className="ald" style={{background:alc[a.ty]}}/><div><div className="alt">{a.t}</div><div className="alti">{a.tm}</div><div style={{display:"flex",gap:6,marginTop:6}}>{(a.ty==="warning"||a.ty==="opportunity")&&<button className="btn bp bsm" style={{padding:"2px 8px",fontSize:".7rem"}} onClick={()=>setRepriceProduct(a.pid)}>{a.ty==="warning"?"Adjust Price":"Raise Price"}</button>}<button className="btn bg bsm" style={{padding:"2px 8px",fontSize:".7rem"}} onClick={()=>setTab("pricing")}>View</button></div></div></div>)}</div></div></div></>}

        {tab==="upload"&&<AddProductFlow onComplete={()=>setTab("listings")} onCancel={()=>setTab("overview")}/>}

        {tab==="bulk"&&<BulkListingMode onComplete={()=>setTab("listings")}/>}

        {tab==="csv"&&<CSVImport onComplete={()=>setTab("listings")}/>}

        {tab==="scanner"&&<BarcodeScanner/>}

        {tab==="listings"&&<div className="pn"><div className="pnh" style={{flexWrap:"wrap",gap:12}}><span className="pnt">All Listings ({fp.length})</span><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{[{k:"all",l:"All"},{k:"amazon",l:"Amazon"},{k:"walmart",l:"Walmart"},{k:"price-alert",l:"Alerts"}].map(x=><button key={x.k} className={`btn bsm ${flt===x.k?"bp":"bs"}`} onClick={()=>setFlt(x.k)}>{x.l}</button>)}<button className="btn bp bsm" onClick={()=>setTab("upload")}><Plus size={14}/> Add</button></div></div><div className="pnb">{fp.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:"var(--g500)"}}><Package size={40} style={{opacity:.3,marginBottom:12}}/><p>No listings found.</p></div>:fp.map(p=><div className="li" key={p.id} style={{cursor:"pointer"}} onClick={()=>setDetailProduct(p.id)}><div className="lt">{p.images?.[0]?<img src={p.images[0]} alt=""/>:<Package size={20}/>}</div><div className="linf"><div className="ln">{p.name}</div><div className="lm">{p.marketplace} · {p.sku||"—"} · {p.category}</div></div><span className="badge" style={{background:p.status==="active"?"#ecfdf5":p.status==="price-alert"?"#fffbeb":"#eff6ff",color:p.status==="active"?"#059669":p.status==="price-alert"?"#d97706":"#2563eb"}}>{p.status==="active"?"Active":p.status==="price-alert"?"Alert":"New"}</span><div className="lp">${p.price}</div></div>)}</div></div>}

        {tab==="pricing"&&<PriceMonitor/>}

        {tab==="profit"&&<ProfitDashboard/>}

        {tab==="inventory"&&<InventoryTracker/>}

        {tab==="alerts"&&<AlertRules/>}

        {tab==="analytics"&&<AnalyticsDash/>}

        {tab==="team"&&<TeamManagement/>}

        {tab==="settings"&&<div className="pn" style={{maxWidth:600}}><div className="pnh"><span className="pnt">Account Settings</span></div><div className="pnb"><div className="ig"><label>Full Name</label><input className="inp" defaultValue={user?.name}/></div><div className="ig"><label>Email</label><input className="inp" defaultValue={user?.email}/></div><div style={{borderTop:"1px solid var(--g200)",paddingTop:20,marginTop:20,marginBottom:20}}><div style={{fontSize:".9rem",fontWeight:700,color:"var(--g800)",marginBottom:16}}>Marketplace Connections</div><div className="ig"><label><span style={{color:"var(--am)"}}>●</span> Amazon Seller ID</label><input className="inp" placeholder="Connect Amazon Seller account"/></div><div className="ig"><label><span style={{color:"var(--wm)"}}>●</span> Walmart Partner ID</label><input className="inp" placeholder="Connect Walmart Partner account"/></div></div><button className="btn bp">Save Changes</button></div></div>}
      </div>
    </main>
  </div>);
}

function Router() {
  const [pg,setPg]=useState("landing"); const {user,loading}=useAuth();
  const go=(t)=>{if(t==="dashboard"&&!user){setPg("login");return;}setPg(t);window.scrollTo(0,0);};
  if(loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--g50)"}}><div style={{textAlign:"center"}}><div className="logo" style={{fontSize:"1.5rem",marginBottom:16}}><span className="dot"/> ShelfPul</div><div style={{width:32,height:32,border:"3px solid var(--g200)",borderTopColor:"var(--p)",borderRadius:"50%",animation:"sp .8s linear infinite",margin:"0 auto"}}/></div></div>;
  if(pg==="login"||pg==="signup") return <AuthPage mode={pg} nav={go}/>;
  if(pg==="dashboard"||(user&&pg!=="landing")) return <Dash nav={go}/>;
  return <Landing nav={go}/>;
}

export default function App() {
  return <ThemeProvider><AuthProvider><ProductsProvider><ToastProvider><style>{CSS}</style><Router/></ToastProvider></ProductsProvider></AuthProvider></ThemeProvider>;
}
