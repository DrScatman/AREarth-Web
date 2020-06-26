import bridge_px from './cube/Bridge2/posx.jpg'
import bridge_py from './cube/Bridge2/posy.jpg'
import bridge_pz from './cube/Bridge2/posz.jpg'
import bridge_nx from './cube/Bridge2/negx.jpg'
import bridge_ny from './cube/Bridge2/negy.jpg'
import bridge_nz from './cube/Bridge2/negz.jpg'
import milkyWay_px from './cube/MilkyWay/dark-s_px.jpg'
import milkyWay_py from './cube/MilkyWay/dark-s_py.jpg'
import milkyWay_pz from './cube/MilkyWay/dark-s_pz.jpg'
import milkyWay_nx from './cube/MilkyWay/dark-s_nx.jpg'
import milkyWay_ny from './cube/MilkyWay/dark-s_ny.jpg'
import milkyWay_nz from './cube/MilkyWay/dark-s_nz.jpg'
import park_px from './cube/Park2/posx.jpg'
import park_py from './cube/Park2/posy.jpg'
import park_pz from './cube/Park2/posz.jpg'
import park_nx from './cube/Park2/negx.jpg'
import park_ny from './cube/Park2/negy.jpg'
import park_nz from './cube/Park2/negz.jpg'
import parkMed_px from './cube/Park3Med/px.jpg'
import parkMed_py from './cube/Park3Med/py.jpg'
import parkMed_pz from './cube/Park3Med/pz.jpg'
import parkMed_nx from './cube/Park3Med/nx.jpg'
import parkMed_ny from './cube/Park3Med/ny.jpg'
import parkMed_nz from './cube/Park3Med/nz.jpg'
import pisa_px from './cube/pisa/px.png'
import pisa_py from './cube/pisa/py.png'
import pisa_pz from './cube/pisa/pz.png'
import pisa_nx from './cube/pisa/nx.png'
import pisa_ny from './cube/pisa/ny.png'
import pisa_nz from './cube/pisa/nz.png'
import skybox_px from './cube/skyboxsun25deg/px.jpg'
import skybox_py from './cube/skyboxsun25deg/py.jpg'
import skybox_pz from './cube/skyboxsun25deg/pz.jpg'
import skybox_nx from './cube/skyboxsun25deg/nx.jpg'
import skybox_ny from './cube/skyboxsun25deg/ny.jpg'
import skybox_nz from './cube/skyboxsun25deg/nz.jpg'
import castle_px from './cube/SwedishRoyalCastle/px.jpg'
import castle_py from './cube/SwedishRoyalCastle/py.jpg'
import castle_pz from './cube/SwedishRoyalCastle/pz.jpg'
import castle_nx from './cube/SwedishRoyalCastle/nx.jpg'
import castle_ny from './cube/SwedishRoyalCastle/ny.jpg'
import castle_nz from './cube/SwedishRoyalCastle/nz.jpg'

const bridge_urls = [bridge_px, bridge_nx, bridge_py, bridge_ny, bridge_pz, bridge_nz];
const milkyWay_urls = [milkyWay_px, milkyWay_nx, milkyWay_py, milkyWay_ny, milkyWay_pz, milkyWay_nz];
const park_urls = [park_px, park_nx, park_py, park_ny, park_pz, park_nz];
const parkMed_urls = [parkMed_px, parkMed_nx, parkMed_py, parkMed_ny, parkMed_pz, parkMed_nz];
const pisa_urls = [pisa_px, pisa_nx, pisa_py, pisa_ny, pisa_pz, pisa_nz];
const skybox_urls = [skybox_px, skybox_nx, skybox_py, skybox_ny, skybox_pz, skybox_nz];
const castle_urls = [castle_px, castle_nx, castle_py, castle_ny, castle_pz, castle_nz];

const all_urls = [bridge_urls, milkyWay_urls, park_urls, parkMed_urls, pisa_urls, skybox_urls, castle_urls];

export {
    all_urls, bridge_urls, milkyWay_urls, park_urls, parkMed_urls, pisa_urls, skybox_urls, castle_urls
}