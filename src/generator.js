import React, { useState } from 'react';
// shadcn/ui Select 컴포넌트 사용 예시
// 필요한 라이브러리를 설치해야 합니다: npm i @shadcn/ui
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@shadcn/ui/select";

const OrganizationTree = () => {
  /**
   * 페이지 상태: '1', '2', '3'
   * 드롭다운에서 선택된 페이지를 저장
   */
  const [currentPage, setCurrentPage] = useState('1');

  /**
   * 아래 config와 기존 조직도 로직은
   * 예시 1번 페이지(기존 코드)에서만 사용
   */
  const [config, setConfig] = useState({
    lineCount: 4,
    shiftsCount: 2,
    miniLineCount: 2,
    hasTonguePrefit: true,
    stockfitRatio: '2:1'
  });

  // 총인원수 예시
  const totalPeople = 42; // 실제 로직에 맞춰 계산 로직 추가

  // 기존 박스 높이/간격
  const TL_BOX_HEIGHT = 80; // h-20
  const TL_BOX_MARGIN = 16; // space-y-4

  /**
   * (공통) 직책 박스 컴포넌트
   */
  const PositionBox = ({ title, subtitle, count, level }) => (
    <div
      className={`
        w-48 h-20
        border border-gray-300 rounded
        flex flex-col justify-center items-center
        ${
          level === 0
            ? 'bg-gray-700 text-white'
            : level === 1
            ? 'bg-gray-500 text-white'
            : level === 2
            ? 'bg-gray-300'
            : level === 3
            ? 'bg-white'
            : 'bg-blue-50'
        }
      `}
    >
      <div className="text-center">
        <div className="font-bold">{title}</div>
        {subtitle && <div className="text-sm">{subtitle}</div>}
        {count > 0 && <div className="text-sm mt-1">TO: {count}</div>}
      </div>
    </div>
  );

  /**
   * (공통) 연결선 컴포넌트
   */
  const ConnectingLines = ({ count, type = 'vertical' }) => {
    if (type !== 'vertical') {
      return (
        <div className="relative h-4 w-full">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300" />
        </div>
      );
    }

    if (count <= 1) {
      return (
        <div className="relative w-full h-8">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />
        </div>
      );
    }

    return (
      <div className="relative w-full h-12">
        <div className="absolute left-1/2 top-0 bottom-1/2 w-px bg-gray-300" />
        <div
          className="absolute top-1/2 h-px bg-gray-300"
          style={{
            left: `${(0.5 / count) * 100}%`,
            right: `${(0.5 / count) * 100}%`
          }}
        />
        {Array(count)
          .fill(null)
          .map((_, idx) => (
            <div
              key={idx}
              className="absolute top-1/2 bottom-0 w-px bg-gray-300"
              style={{
                left: `${((idx + 0.5) / count) * 100}%`
              }}
            />
          ))}
      </div>
    );
  };

  /**
   * (공통) 예시 공정 데이터를 만드는 함수
   */
  const getProcessGroups = () => [
    {
      gl: { subtitle: 'Cutting-Prefit', count: 1 },
      tlGroup: Array(config.shiftsCount)
        .fill(null)
        .map((_, idx) => ({
          subtitle: `No-sew Shift${idx + 1}`
        })),
      tmGroup: Array(config.shiftsCount)
        .fill(null)
        .map((_, idx) => ({
          subtitle: `MH → No-sew Shift${idx + 1}`
        }))
    },
    {
      gl: { subtitle: 'Stitching', count: 1 },
      tlGroup: [
        ...Array(config.miniLineCount)
          .fill(null)
          .map((_, idx) => ({
            subtitle: `mini Line ${idx + 1}`
          })),
        { subtitle: 'Tongue Prefit' }
      ],
      tmGroup: Array(config.miniLineCount)
        .fill(null)
        .map((_, idx) => ({
          subtitle: `MH → Stitching${idx + 1}`
        }))
    },
    {
      gl: { subtitle: 'Stockfit', count: 1 },
      tlGroup:
        config.stockfitRatio === '1:1'
          ? [{ subtitle: 'Stockfit' }]
          : [
              { subtitle: 'Stockfit Input' },
              { subtitle: 'Stockfit Output' }
            ],
      tmGroup: [{ subtitle: 'MH → Assembly' }]
    },
    {
      gl: { subtitle: 'Assembly', count: 1 },
      tlGroup: [
        { subtitle: 'Input' },
        { subtitle: 'Cementing' },
        { subtitle: 'Finishing' }
      ],
      tmGroup: [
        { subtitle: 'MH → Assembly' },
        { subtitle: 'MH → FG WH' },
        { subtitle: 'MH → Last' }
      ]
    }
  ];

  /**
   * (공통) VSM 그룹: 페이지1 조직도에만 적용 예시
   */
  const VSMGroup = ({ vsm }) => {
    const processGroups = getProcessGroups();
    const tlHeights = processGroups.map((group) => {
      const tlCount = group.tlGroup.length;
      return tlCount * TL_BOX_HEIGHT + (tlCount - 1) * TL_BOX_MARGIN;
    });
    const maxTLHeight = Math.max(...tlHeights);

    return (
      <div className="flex flex-col items-center">
        <PositionBox title="VSM" subtitle={vsm.subtitle} count={1} level={1} />
        <ConnectingLines count={processGroups.length} />
        <div className="flex flex-row space-x-8">
          {processGroups.map((group, idx) => {
            const glHeight = tlHeights[idx];
            const spacerHeight = Math.max(0, maxTLHeight - glHeight) + 30;

            return (
              <div key={idx} className="flex flex-col items-center">
                <PositionBox
                  title="GL"
                  subtitle={group.gl.subtitle}
                  count={group.gl.count}
                  level={2}
                />
                <ConnectingLines count={1} />
                <div className="flex flex-col space-y-4">
                  {group.tlGroup.map((tl, tlIdx) => (
                    <div key={tlIdx} className="flex flex-col items-center">
                      <PositionBox
                        title="TL"
                        subtitle={tl.subtitle}
                        count={1}
                        level={3}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ height: `${spacerHeight}px` }} />
                <div className="flex flex-col space-y-4">
                  {group.tmGroup?.map((tm, tmIdx) => (
                    <div key={tmIdx} className="flex flex-col items-center">
                      <PositionBox
                        title="TM"
                        subtitle={tm.subtitle}
                        count={1}
                        level={4}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * 페이지별 조직도 렌더링 함수
   * - switch문으로 페이지 구분
   * - 실제 데이터/디자인은 필요에 따라 교체
   */
  const renderOrgChart = (page) => {
    switch (page) {
      case '1':
        // 기존 예시 페이지(조직도)
        return (
          <div className="p-8 w-full border rounded-lg shadow-sm">
            <div className="overflow-auto">
              <div className="flex flex-col items-center">
                <PositionBox
                  title="MGL"
                  subtitle="Plant A"
                  count={1}
                  level={0}
                />
                <ConnectingLines count={config.lineCount} />
                <div className="flex flex-row justify-center space-x-12">
                  {Array(config.lineCount)
                    .fill(null)
                    .map((_, i) => (
                      <VSMGroup key={i} vsm={{ subtitle: `Line ${i + 1}` }} />
                    ))}
                </div>
              </div>
            </div>

            {/* 하단 설정 영역 */}
            <div className="mt-8 border-t pt-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm mb-1">라인 수</label>
                  <input
                    type="number"
                    value={config.lineCount}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        lineCount: parseInt(e.target.value)
                      })
                    }
                    className="border rounded p-1 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">교대 수</label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={config.shiftsCount}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        shiftsCount: parseInt(e.target.value)
                      })
                    }
                    className="border rounded p-1 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">미니 라인 수</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={config.miniLineCount}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        miniLineCount: parseInt(e.target.value)
                      })
                    }
                    className="border rounded p-1 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Stockfit 비율</label>
                  <select
                    value={config.stockfitRatio}
                    onChange={(e) =>
                      setConfig({ ...config, stockfitRatio: e.target.value })
                    }
                    className="border rounded p-1 w-full"
                  >
                    <option value="1:1">1:1 (Assembly:Stockfit)</option>
                    <option value="2:1">2:1 (Assembly:Stockfit)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case '2':
        // 페이지2 예시(간단한 안내)
        return (
          <div className="p-8 border rounded-lg shadow-sm">
            <h2 className="text-xl font-bold">페이지 2</h2>
            <p className="mt-4">여기에 페이지2의 조직도/디자인을 구성하세요.</p>
          </div>
        );
      case '3':
        // 페이지3 예시(간단한 안내)
        return (
          <div className="p-8 border rounded-lg shadow-sm">
            <h2 className="text-xl font-bold">페이지 3</h2>
            <p className="mt-4">여기에 페이지3의 조직도/디자인을 구성하세요.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 페이지 선택 드롭다운 (조직도 화면 좌측 상단에 absolute로 배치) */}
      <div className="absolute top-4 left-4">
        <Select value={currentPage} onValueChange={setCurrentPage}>
          <SelectTrigger className="w-32 bg-white">
            <SelectValue placeholder="페이지 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">페이지 1</SelectItem>
            <SelectItem value="2">페이지 2</SelectItem>
            <SelectItem value="3">페이지 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 현재 선택된 페이지의 조직도 표시 */}
      <div className="pt-24 px-8">{renderOrgChart(currentPage)}</div>

      {/* 총인원수 표시 박스(조직도 화면 우측 하단) */}
      <div className="absolute bottom-4 right-4 bg-white border shadow-md rounded p-4">
        <div className="font-semibold">총인원수: {totalPeople}</div>
      </div>
    </div>
  );
};

export default OrganizationTree;
