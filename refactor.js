const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'apps', 'api', 'src', 'modules');

const mappings = {
  // AulaRepository
  'findTotalAulasPorTurma': 'countByTurmaId',
  'findAulasPorDisciplinaPorTurma': 'countByTurmaIdGroupByDisciplinaId',

  // DisciplinaRepository
  'createDisciplina': 'save',
  'udpateDisciplina': 'updateById',
  'findDisciplinaPorId': 'findById',
  // 'findAll': 'findAll', // no change
  'findDisciplinaPorNome': 'findByNome',
  'findDisciplinasPorTurma': 'findByTurmaId',
  'countAllDisciplinasAtivas': 'countByDeletedAtIsNull',
  
  // EventoRepository
  'findEventosPorTurma': 'findByTurmaId',
  'findNotasEventosPorMatricula': 'findNotasByMatriculaId',

  // FrequenciaRepository
  'sumFaltasPorMatricula': 'sumNumeroFaltasByMatriculaId',
  'findFrequenciasPorMatricula': 'findByMatriculaId',

  // MatriculaRepository
  'createMatriculaComRendimentos': 'saveWithRendimentos',
  'findMatriculaPorAluno': 'findByAlunoId',
  'findMatriculasEmCursoPorTurma': 'findByTurmaIdAndStatusCursando',
  'findMatriculasEncerradasPorTurma': 'findByTurmaIdAndStatusNotCursando',
  'findMatriculaPorAlunoEAnoLetivo': 'findByAlunoIdAndAnoLetivo',
  'findMatriculaPorAlunoETurma': 'findByAlunoIdAndTurmaId',
  'findMatriculaAtivaPorAlunoETurma': 'findByAlunoIdAndTurmaIdAndStatusCursando',
  'updateStatusMatricula': 'updateStatusById',
  'transferirMatriculaERendimentos': 'updateStatusTransferidoById',
  'reativarMatriculaERendimentos': 'updateStatusCursandoById',

  // RendimentoRepository
  'createRendimento': 'save',
  'findRendimentosPorMatricula': 'findByMatriculaId',
  'updateSituacaoRendimento': 'updateSituacaoById',

  // TurmaRepository
  // 'create': 'save', // handle generic below
  'findTurmaPorId': 'findById',
  'findTurmaComMatriculasPorId': 'findByIdWithMatriculas',
  'findProfessorTurma': 'findProfessorTurmaByTurmaIdAndProfessorIdAndDisciplinaId',
  // 'findDisciplinasPorTurma' handled below since generic, wait, it's unique
  'countAllTurmasEmAndamentoAtivas': 'countBySituacaoEmAndamentoAndDeletedAtIsNull',
  'updateTurma': 'updateById',
  'updateSituacaoTurma': 'updateSituacaoById',
  
  // UsuarioRepository
  'createAdministrador': 'saveAdministrador',
  'createProfessor': 'saveProfessor',
  'createAluno': 'saveAluno',
  'updateUsuario': 'updateById',
  'updateSenhaUsuario': 'updateSenhaById',
  'getAllUsuarios': 'findAll',
  'getUsuarioPorUsuario': 'findByUsuario',
  'getUsuarioPorId': 'findById',
  'getProfessorPorId': 'findByProfessorId',
  'getAlunoPorId': 'findByAlunoId',
  'countAllAlunosAtivosComMatriculaCursando': 'countByPapelAlunoAndDeletedAtIsNullAndMatriculaStatusCursando',
  'countAllProfessoresAtivos': 'countByPapelProfessorAndDeletedAtIsNull',
};

const genericMappings = [
  { old: 'create', new: 'save', repoMatch: 'turmaRepository' },
  { old: 'softDelete', new: 'deleteById', repoMatch: '[a-zA-Z]*[rR]epository' },
  { old: 'restore', new: 'restoreById', repoMatch: '[a-zA-Z]*[rR]epository' },
  { old: 'vincularProfessor', new: 'saveProfessorTurma', repoMatch: 'turmaRepository' },
  { old: 'desvincularProfessor', new: 'deleteProfessorTurma', repoMatch: 'turmaRepository' },
  { old: 'findDisciplinasPorTurma', new: 'findDisciplinasByTurmaId', repoMatch: '[a-zA-Z]*[rR]epository' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // 1. Replace unique mappings
  for (const [oldName, newName] of Object.entries(mappings)) {
    // Replace calls: this.repo.oldName(
    let regexCall = new RegExp(`\\b${oldName}\\s*\\(`, 'g');
    content = content.replace(regexCall, `${newName}(`);
    
    // Replace signatures: async oldName(
    let regexSig = new RegExp(`async\\s+${oldName}\\s*\\(`, 'g');
    content = content.replace(regexSig, `async ${newName}(`);
  }

  // 2. Replace generic mappings safely
  for (const mapping of genericMappings) {
    // Calls: this.turmaRepository.create(
    let regexCall = new RegExp(`(this\\.${mapping.repoMatch}\\.)${mapping.old}\\s*\\(`, 'g');
    content = content.replace(regexCall, `$1${mapping.new}(`);

    // Repository signatures: only replace if we are in a repository file
    if (filePath.endsWith('.repository.ts')) {
      let regexSig = new RegExp(`async\\s+${mapping.old}\\s*\\(`, 'g');
      content = content.replace(regexSig, `async ${mapping.new}(`);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk(directory);
console.log('Refactoring complete.');
