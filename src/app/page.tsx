'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'inicio' | 'mediacion' | 'servicios' | 'requisitos' | 'oficinas';

// Tipos de mediacion
const TIPOS_MEDIACION = [
  {
    id: 'familia-alimentos',
    nombre: 'Pension de Alimentos',
    categoria: 'familia',
    sesiones: '2-4',
    duracion: '1-2 meses',
    obligatoria: true,
  },
  {
    id: 'familia-visitas',
    nombre: 'Relacion Directa y Regular',
    categoria: 'familia',
    sesiones: '2-4',
    duracion: '1-2 meses',
    obligatoria: true,
  },
  {
    id: 'familia-cuidado',
    nombre: 'Cuidado Personal',
    categoria: 'familia',
    sesiones: '3-5',
    duracion: '1-3 meses',
    obligatoria: true,
  },
  {
    id: 'familia-patria',
    nombre: 'Patria Potestad',
    categoria: 'familia',
    sesiones: '2-4',
    duracion: '1-2 meses',
    obligatoria: false,
  },
  {
    id: 'vecinal',
    nombre: 'Conflictos Vecinales',
    categoria: 'comunitaria',
    sesiones: '1-3',
    duracion: '2-4 semanas',
    obligatoria: false,
  },
  {
    id: 'arrendamiento',
    nombre: 'Arrendamiento',
    categoria: 'civil',
    sesiones: '2-3',
    duracion: '2-4 semanas',
    obligatoria: false,
  },
  {
    id: 'deudas',
    nombre: 'Deudas entre Particulares',
    categoria: 'civil',
    sesiones: '2-3',
    duracion: '2-4 semanas',
    obligatoria: false,
  },
  {
    id: 'laboral',
    nombre: 'Conflictos Laborales',
    categoria: 'laboral',
    sesiones: '1-3',
    duracion: '2-4 semanas',
    obligatoria: false,
  },
];

function MediacionCalculator() {
  const [tipoMediacion, setTipoMediacion] = useState<string>('');
  const [montoDisputa, setMontoDisputa] = useState<string>('');
  const [urgencia, setUrgencia] = useState<'normal' | 'urgente'>('normal');
  const [resultado, setResultado] = useState<{
    tipo: typeof TIPOS_MEDIACION[0];
    ahorroPotencial: number;
    costoJuicio: number;
    tiempoJuicio: string;
    recomendacion: string;
  } | null>(null);

  const calcularMediacion = () => {
    if (!tipoMediacion) return;

    const tipo = TIPOS_MEDIACION.find(t => t.id === tipoMediacion);
    if (!tipo) return;

    const monto = parseInt(montoDisputa) || 0;

    // Estimacion de costos de juicio vs mediacion
    // Juicio: honorarios abogado (10-20% de la cuantia, min $500.000) + costas
    const costoAbogado = Math.max(500000, monto * 0.15);
    const costasJudiciales = 150000;
    const costoJuicio = costoAbogado + costasJudiciales;

    // Mediacion CAJ es gratuita
    const ahorroPotencial = costoJuicio;

    // Tiempo estimado de juicio segun tipo
    let tiempoJuicio = '6-12 meses';
    if (tipo.categoria === 'familia') {
      tiempoJuicio = '6-18 meses';
    } else if (tipo.categoria === 'laboral') {
      tiempoJuicio = '4-8 meses';
    }

    // Recomendacion
    let recomendacion = 'La mediacion es recomendable para su caso.';
    if (tipo.obligatoria) {
      recomendacion = 'La mediacion es OBLIGATORIA antes de demandar en este tipo de caso (Ley 19.968).';
    } else if (monto > 0 && monto < 5000000) {
      recomendacion = 'Para montos menores, la mediacion es altamente recomendable por el ahorro en costos.';
    }

    setResultado({
      tipo,
      ahorroPotencial,
      costoJuicio,
      tiempoJuicio,
      recomendacion,
    });
  };

  const formatCLP = (value: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <h2 className="text-2xl font-bold text-teal-400 mb-6 flex items-center gap-2">
        <span>🤝</span> Calculadora de Mediacion
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Tipo de Conflicto</label>
            <select
              value={tipoMediacion}
              onChange={(e) => setTipoMediacion(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Seleccione un tipo</option>
              <optgroup label="Familia (Obligatoria)">
                {TIPOS_MEDIACION.filter(t => t.categoria === 'familia').map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre} {tipo.obligatoria ? '⚠️' : ''}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Civil">
                {TIPOS_MEDIACION.filter(t => t.categoria === 'civil').map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </optgroup>
              <optgroup label="Comunitaria">
                {TIPOS_MEDIACION.filter(t => t.categoria === 'comunitaria').map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </optgroup>
              <optgroup label="Laboral">
                {TIPOS_MEDIACION.filter(t => t.categoria === 'laboral').map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Monto en Disputa (opcional)</label>
            <input
              type="number"
              value={montoDisputa}
              onChange={(e) => setMontoDisputa(e.target.value)}
              placeholder="Ej: 1000000"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <p className="text-gray-500 text-sm mt-1">Para calcular ahorro vs juicio</p>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Urgencia</label>
            <select
              value={urgencia}
              onChange={(e) => setUrgencia(e.target.value as 'normal' | 'urgente')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="normal">Normal</option>
              <option value="urgente">Urgente (menores involucrados)</option>
            </select>
          </div>

          <button
            onClick={calcularMediacion}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Evaluar Mediacion
          </button>
        </div>

        <div className="space-y-4">
          {resultado && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-lg p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-teal-400 mb-4">Evaluacion de Mediacion</h3>

              <div className="space-y-3">
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-gray-400 text-sm">Tipo de Mediacion</p>
                  <p className="text-white font-bold">{resultado.tipo.nombre}</p>
                  <p className="text-teal-400 text-sm">Categoria: {resultado.tipo.categoria}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 p-3 rounded">
                    <p className="text-gray-400 text-sm">Sesiones Estimadas</p>
                    <p className="text-white font-bold">{resultado.tipo.sesiones}</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <p className="text-gray-400 text-sm">Duracion</p>
                    <p className="text-white font-bold">{resultado.tipo.duracion}</p>
                  </div>
                </div>

                {resultado.tipo.obligatoria && (
                  <div className="bg-yellow-900/30 border border-yellow-700 rounded p-3">
                    <p className="text-yellow-400 font-semibold">⚠️ Mediacion Obligatoria</p>
                    <p className="text-gray-300 text-sm">Debe intentar mediacion antes de demandar</p>
                  </div>
                )}

                {parseInt(montoDisputa) > 0 && (
                  <>
                    <div className="border-t border-gray-700 pt-3">
                      <h4 className="text-white font-semibold mb-2">Comparativa de Costos</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Costo Mediacion CAJ:</span>
                          <span className="text-green-400 font-bold">GRATIS</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Costo Juicio Estimado:</span>
                          <span className="text-red-400 font-semibold">{formatCLP(resultado.costoJuicio)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tiempo Juicio:</span>
                          <span className="text-orange-400">{resultado.tiempoJuicio}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-900/30 border border-green-700 rounded p-3">
                      <p className="text-green-400 text-sm">Ahorro Potencial</p>
                      <p className="text-green-400 font-bold text-xl">{formatCLP(resultado.ahorroPotencial)}</p>
                    </div>
                  </>
                )}

                <div className="bg-blue-900/30 border border-blue-700 rounded p-3">
                  <p className="text-blue-400 font-semibold">Recomendacion</p>
                  <p className="text-gray-300 text-sm mt-1">{resultado.recomendacion}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="bg-teal-900/30 border border-teal-700 rounded-lg p-4">
            <h4 className="text-teal-400 font-semibold mb-2">Ventajas de la Mediacion</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Gratuita en CAJ y centros licitados</li>
              <li>• Rapida (semanas vs meses de juicio)</li>
              <li>• Confidencial</li>
              <li>• Las partes deciden la solucion</li>
              <li>• Acuerdo tiene valor de sentencia</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InicioView() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-teal-900/50 to-cyan-900/50 rounded-xl p-8 border border-teal-700"
      >
        <h1 className="text-3xl font-bold text-teal-400 mb-4">Corporacion de Asistencia Judicial</h1>
        <p className="text-gray-300 text-lg">
          Asistencia juridica gratuita para personas de escasos recursos. Mediacion familiar, orientacion legal y representacion judicial.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: '🤝', title: 'Mediacion Familiar', desc: 'Resolucion de conflictos familiares sin juicio' },
          { icon: '⚖️', title: 'Asistencia Legal', desc: 'Abogados gratuitos para casos civiles y familia' },
          { icon: '📋', title: 'Orientacion', desc: 'Informacion sobre derechos y tramites legales' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <span className="text-4xl">{item.icon}</span>
            <h3 className="text-xl font-semibold text-white mt-4">{item.title}</h3>
            <p className="text-gray-400 mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-teal-400 mb-4">Tipos de Mediacion Disponibles</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {TIPOS_MEDIACION.map((tipo, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-700/30 rounded px-4 py-3">
              <div>
                <span className="text-white">{tipo.nombre}</span>
                {tipo.obligatoria && (
                  <span className="ml-2 px-2 py-0.5 bg-yellow-900/50 text-yellow-400 text-xs rounded">Obligatoria</span>
                )}
              </div>
              <span className="text-teal-400 text-sm">{tipo.sesiones} sesiones</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiciosView() {
  const servicios = [
    {
      nombre: 'Mediacion Familiar',
      descripcion: 'Resolucion de conflictos de alimentos, visitas, cuidado personal',
      requisitos: 'Gratuito para todos',
      icono: '👨‍👩‍👧',
    },
    {
      nombre: 'Asesoria Juridica',
      descripcion: 'Orientacion legal en materias civiles, familia y laborales',
      requisitos: 'Evaluacion socioeconomica',
      icono: '📋',
    },
    {
      nombre: 'Patrocinio Judicial',
      descripcion: 'Representacion por abogado en juicios',
      requisitos: 'Evaluacion socioeconomica',
      icono: '⚖️',
    },
    {
      nombre: 'Solucion Colaborativa',
      descripcion: 'Mediacion en conflictos vecinales y comunitarios',
      requisitos: 'Gratuito para todos',
      icono: '🏘️',
    },
    {
      nombre: 'Centros de Mediacion',
      descripcion: 'Mediacion licitada por el Ministerio de Justicia',
      requisitos: 'Gratuito para todos',
      icono: '🤝',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-teal-400 mb-6">Servicios CAJ</h2>

        <div className="space-y-4">
          {servicios.map((s, i) => (
            <div key={i} className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{s.icono}</span>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{s.nombre}</h3>
                  <p className="text-gray-400 text-sm mt-1">{s.descripcion}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-teal-900/50 text-teal-400 text-xs rounded">
                    {s.requisitos}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">Materias que Atiende CAJ</h4>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-300">
          <div>• Pension de alimentos</div>
          <div>• Cuidado personal de hijos</div>
          <div>• Regimen de visitas</div>
          <div>• Divorcio</div>
          <div>• Violencia intrafamiliar</div>
          <div>• Arrendamiento</div>
          <div>• Cobro de deudas</div>
          <div>• Defensa laboral</div>
        </div>
      </div>
    </motion.div>
  );
}

function RequisitosView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-teal-400 mb-6">Requisitos para Atencion</h2>

        <div className="space-y-6">
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <h3 className="text-green-400 font-semibold mb-3">Mediacion Familiar - Sin Requisitos</h3>
            <p className="text-gray-300 text-sm">
              La mediacion familiar es GRATUITA para todas las personas, sin importar su situacion economica.
              Solo debe solicitar hora en un centro de mediacion.
            </p>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Asistencia Juridica - Con Evaluacion</h3>
            <p className="text-gray-300 text-sm mb-4">
              Para recibir asistencia de abogado gratuito, debe cumplir requisitos socioeconomicos:
            </p>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-400">•</span>
                <span>Pertenecer al 80% mas vulnerable segun RSH</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400">•</span>
                <span>Ingresos per capita bajo 3 sueldos minimos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400">•</span>
                <span>No tener recursos para contratar abogado particular</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Documentos Requeridos</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-teal-400">📄</span>
                <span>Cedula de identidad</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-400">📄</span>
                <span>Registro Social de Hogares (RSH)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-400">📄</span>
                <span>Certificado de nacimiento (casos de menores)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-400">📄</span>
                <span>Documentos del caso (contratos, sentencias, etc.)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
        <h4 className="text-yellow-400 font-semibold mb-2">Importante</h4>
        <p className="text-gray-300 text-sm">
          La evaluacion socioeconomica se realiza en la primera atencion. Si no califica para asistencia gratuita,
          igual puede recibir orientacion legal y derivacion a otros servicios.
        </p>
      </div>
    </motion.div>
  );
}

function OficinasView() {
  const corporaciones = [
    { nombre: 'CAJ Region Metropolitana', telefono: '600 440 2000', web: 'www.cajmetro.cl' },
    { nombre: 'CAJ Valparaiso', telefono: '600 712 0001', web: 'www.cajval.cl' },
    { nombre: 'CAJ Biobio', telefono: '600 712 0002', web: 'www.cajbiobio.cl' },
    { nombre: 'CAJ Tarapaca y Antofagasta', telefono: '600 712 0003', web: 'www.cajta.cl' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-teal-400 mb-6">Oficinas y Contacto</h2>

        <div className="space-y-4">
          {corporaciones.map((c, i) => (
            <div key={i} className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-white font-semibold">{c.nombre}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span>📞</span> {c.telefono}
                </p>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span>🌐</span> {c.web}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Centros de Mediacion Licitados</h3>
        <p className="text-gray-400 mb-4">
          Ademas de las CAJ, existen centros de mediacion licitados por el Ministerio de Justicia
          en todo el pais. Para encontrar el mas cercano:
        </p>
        <a
          href="https://www.mediacionchile.cl"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          🔍 Buscar Centro de Mediacion
        </a>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Recursos Utiles</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'Mediacion Chile', url: 'https://www.mediacionchile.cl', desc: 'Portal oficial de mediacion' },
            { name: 'Min. Justicia', url: 'https://www.minjusticia.gob.cl', desc: 'Ministerio de Justicia' },
            { name: 'Registro Civil', url: 'https://www.registrocivil.cl', desc: 'Certificados y documentos' },
            { name: 'RSH', url: 'https://www.registrosocial.gob.cl', desc: 'Registro Social de Hogares' },
          ].map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-700/50 hover:bg-gray-700 rounded-lg p-4 transition-colors"
            >
              <h4 className="text-teal-400 font-semibold">{r.name}</h4>
              <p className="text-gray-400 text-sm mt-1">{r.desc}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="bg-teal-900/30 border border-teal-700 rounded-lg p-4">
        <h4 className="text-teal-400 font-semibold mb-2">Linea de Orientacion</h4>
        <p className="text-3xl font-bold text-white">600 440 2000</p>
        <p className="text-gray-300 text-sm mt-1">Lunes a Viernes, 9:00 a 17:00 hrs</p>
      </div>
    </motion.div>
  );
}

export default function CAJModule() {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'mediacion', label: 'Calculadora', icon: '🤝' },
    { id: 'servicios', label: 'Servicios', icon: '⚖️' },
    { id: 'requisitos', label: 'Requisitos', icon: '📋' },
    { id: 'oficinas', label: 'Oficinas', icon: '📍' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏛️</span>
              <div>
                <h1 className="text-xl font-bold text-white">CAJ - Asistencia Juridica</h1>
                <p className="text-sm text-gray-400">NewCooltura Informada</p>
              </div>
            </div>
            <a
              href="https://newcool-informada.vercel.app"
              className="text-teal-400 hover:text-teal-300 text-sm"
            >
              ← Volver al Hub
            </a>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-teal-400 border-teal-400'
                    : 'text-gray-400 border-transparent hover:text-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'inicio' && <InicioView key="inicio" />}
          {activeTab === 'mediacion' && <MediacionCalculator key="mediacion" />}
          {activeTab === 'servicios' && <ServiciosView key="servicios" />}
          {activeTab === 'requisitos' && <RequisitosView key="requisitos" />}
          {activeTab === 'oficinas' && <OficinasView key="oficinas" />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>La mediacion familiar es gratuita para todos. Consulte en su CAJ mas cercana.</p>
          <p className="mt-2">NewCooltura Informada - CAJ</p>
        </div>
      </footer>
    </div>
  );
}
